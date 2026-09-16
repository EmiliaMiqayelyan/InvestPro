import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

/** Memberships and payments share the same data source - keep one admin screen. */
export default function AdminMembershipsRedirect() {
  redirect(ROUTES.ADMIN_PAYMENTS);
}
