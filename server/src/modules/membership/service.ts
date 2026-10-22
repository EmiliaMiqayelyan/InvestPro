import { v4 as uuidv4 } from "uuid";
import type { MembershipPlan, MembershipPlanId } from "../../shared/types";
import { UserModel, SubscriptionModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toUser, toSubscription } from "../../shared/utils/mappers";
import { logActivity } from "../../shared/utils/activity";
import { createTokenPair } from "../../shared/utils/jwt";
import { dispatchNotificationEvent } from "../notifications/service";
import { sendServiceFeeReceipt } from "../../shared/integrations/email";
import { createServiceFeeCheckout } from "../payments/service";

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
      "Փուլերի պլանավորում սեփականատերերի հետ",
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

export async function activateMembershipFromPayment(userId: string, amount: number, paymentId: string) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");
  const existing = await SubscriptionModel.findOne({ where: { stripeSessionId: paymentId } });
  if (existing) {
    return { user: toUser(user), subscription: toSubscription(existing), tokens: await createTokenPair(toUser(user)) };
  }

  const base = user.membershipExpiresAt && user.membershipExpiresAt.getTime() > Date.now()
    ? user.membershipExpiresAt
    : new Date();
  const expiresAt = new Date(base.getTime() + 30 * 86400000);
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
    amount,
    stripeSessionId: paymentId,
  });

  await logActivity(userId, "membership_purchased", "membership", "service", {
    amount,
    paymentId,
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
  const opened = await createServiceFeeCheckout(userId);
  return {
    checkoutUrl: opened.checkoutUrl,
    sessionId: opened.payment.id,
    paymentId: opened.payment.id,
    planId,
  };
}
