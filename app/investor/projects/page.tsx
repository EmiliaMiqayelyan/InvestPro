"use client";

import { MarketplaceBrowser } from "@/features/projects/marketplace-browser";
import { ROUTES } from "@/constants";

export default function InvestorProjectsPage() {
  return <MarketplaceBrowser projectBasePath={ROUTES.INVESTOR_PROJECTS} compact />;
}
