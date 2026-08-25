import { v4 as uuidv4 } from "uuid";
import type { MembershipPlan, MembershipPlanId } from "../../shared/types";
import { UserModel, SubscriptionModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toUser, toSubscription } from "../../shared/utils/mappers";
import { logActivity } from "../../shared/utils/activity";
import { createTokenPair } from "../../shared/utils/jwt";
import { dispatchNotificationEvent } from "../notifications/service";
import { sendServiceFeeReceipt } from "../../shared/integrations/email";
import { createServiceFeeCheckoutSession } from "../../shared/integrations/stripe";

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "service",
    name: "Platform Service Access",
    nameHy: "Հարթակի ծառայության հասանելիություն",
    price: 99,
    billingPeriod: "monthly",
    description:
      "Monthly platform service fee for full diligence access, messaging, and offers. This is not investment capital.",
    descriptionHy:
      "Ամսական հարթակի ծառայության վճար՝ լրիվ ստուգման հասանելիության, հաղորդագրությունների և առաջարկների համար։ Սա ներդրումային կապիտալ չէ։",
    features: [
      "Full project materials & data room",
      "Documents, team, and financial detail",
      "Direct platform messaging",
      "Send investment offers",
      "Full risk analysis reports",
      "Milestone planning with owners",
    ],
    featuresHy: [
      "Լրիվ նախագծի նյութեր և տվյալների սենյակ",
      "Փաստաթղթեր, թիմ և ֆինանսական մանրամասներ",
      "Ուղիղ հարթակային հաղորդագրություններ",
      "Ներդրումային առաջարկներ ուղարկել",
      "Լրիվ ռիսկի վերլուծության զեկույցներ",
      "Նշաձողերի պլանավորում սեփականատերերի հետ",
    ],
    highlighted: true,
  },
];

export async function getMyMembership(userId: string) {
  const user = await UserModel.findByPk(userId);
  const sub = await SubscriptionModel.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return {
    tier: user?.membershipTier || "none",
    expiresAt: user?.membershipExpiresAt?.toISOString(),
    subscription: sub ? toSubscription(sub) : null,
  };
}

export async function subscribe(userId: string, planId: MembershipPlanId = "service") {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");
  if (planId !== "service") throw AppError.badRequest("Invalid plan");
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
  if (!plan) throw AppError.badRequest("Invalid plan");

  const expiresAt = new Date(Date.now() + 30 * 86400000);
  user.membershipTier = "service";
  user.membershipExpiresAt = expiresAt;
  await user.save();

  const sub = await SubscriptionModel.create({
    id: uuidv4(),
    userId,
    planId: "service",
    status: "active",
    startedAt: new Date(),
    expiresAt,
    amount: plan.price,
    stripeSessionId: null,
  });

  await logActivity(userId, "membership_purchased", "membership", planId, {
    amount: plan.price,
  });

  const safe = toUser(user);
  const tokens = await createTokenPair(safe);
  try {
    await sendServiceFeeReceipt(user.email, sub.amount);
  } catch {
    /* non-blocking */
  }
  await dispatchNotificationEvent({
    kind: "membership_activated",
    userId,
    amount: sub.amount,
  });

  return { user: safe, subscription: toSubscription(sub), tokens };
}

export async function checkout(userId: string, planId: MembershipPlanId = "service") {
  if (planId !== "service") throw AppError.badRequest("Invalid plan");
  const user = await UserModel.findByPk(userId);
  const session = await createServiceFeeCheckoutSession({
    userId,
    email: user?.email || "",
    successUrl: "/investor/membership?checkout=mock",
    cancelUrl: "/investor/membership",
  });
  return { checkoutUrl: session.checkoutUrl, sessionId: session.sessionId, planId };
}
