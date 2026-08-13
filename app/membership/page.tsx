import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function MembershipRoute() {
  redirect(ROUTES.INVESTOR_MEMBERSHIP);
}
