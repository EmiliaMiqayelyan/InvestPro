/**
 * Curated thematic photography for marketing & auth surfaces.
 * Cool-toned, professional imagery unified with teal overlays in CSS.
 */
export const THEMATIC_IMAGES = {
  hero: {
    marketplace:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80&crop=entropy",
    investment:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80&crop=focalpoint&fp-x=0.5&fp-y=0.4",
    growth:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80&crop=entropy",
  },
  sections: {
    investors:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    owners:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    team:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    security:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    handshake:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80&crop=focalpoint&fp-x=0.55&fp-y=0.45",
    mission:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    contact:
      "https://images.unsplash.com/photo-1423666639045-7a412c023360?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    membership:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    marketplace:
      "https://images.unsplash.com/photo-1618044732200-d6a8b604031a?auto=format&fit=crop&w=1600&q=80&crop=entropy",
    diligence:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80&crop=entropy",
    innovation:
      "https://images.unsplash.com/photo-1518770660439-4637920f4930?auto=format&fit=crop&w=1200&q=80&crop=entropy",
  },
  auth: {
    panel:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80&crop=entropy",
  },
} as const;

export type ThematicImageKey =
  | keyof typeof THEMATIC_IMAGES.hero
  | keyof typeof THEMATIC_IMAGES.sections
  | keyof typeof THEMATIC_IMAGES.auth;
