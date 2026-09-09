/**
 * Investment-themed photography for marketing content sections.
 * Sourced from Unsplash (investment / finance), 1600–1920px, Unsplash License.
 * Home landing hero uses photography; other page/CTA banners use color gradients.
 */
export const THEMATIC_IMAGES = {
  hero: {
    marketplace: "/images/hero-marketplace.jpg",
    investment: "/images/hero-investment.jpg",
    growth: "/images/hero-growth.jpg",
  },
  sections: {
    /** Analytics / capital allocation */
    investors: "/images/section-investors.jpg",
    /** Founders & operators collaborating */
    owners: "/images/section-owners.jpg",
    /** Team collaboration */
    team: "/images/section-team.jpg",
    /** Trust, verification, secure access */
    security: "/images/section-security.jpg",
    /** Partnership / agreement */
    handshake: "/images/section-handshake.jpg",
    /** Mission / cityscape ambition */
    mission: "/images/section-mission.jpg",
    /** Contact / communication */
    contact: "/images/section-contact.jpg",
    /** Membership / premium access */
    membership: "/images/section-membership.jpg",
    /** Marketplace / data overview */
    marketplace: "/images/section-marketplace.jpg",
    /** Due diligence / document review */
    diligence: "/images/section-diligence.jpg",
    /** Innovation / technology */
    innovation: "/images/section-innovation.jpg",
    /** Empty marketplace state */
    empty: "/images/empty-projects.jpg",
  },
  auth: {
    panel: "/images/auth-panel.jpg",
  },
} as const;

export type ThematicImageKey =
  | keyof typeof THEMATIC_IMAGES.hero
  | keyof typeof THEMATIC_IMAGES.sections
  | keyof typeof THEMATIC_IMAGES.auth;
