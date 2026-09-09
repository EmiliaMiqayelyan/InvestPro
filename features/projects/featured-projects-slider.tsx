"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { MarketplaceProjectCard } from "@/features/projects/project-card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";

type MarketplaceProject = Project & { teamSize?: number };

export function FeaturedProjectsSlider({
  projects,
}: {
  projects: MarketplaceProject[];
}) {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateControls = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateControls();
    el.addEventListener("scroll", updateControls, { passive: true });
    const ro = new ResizeObserver(updateControls);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateControls);
      ro.disconnect();
    };
  }, [projects, updateControls]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (projects.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p) => (
          <div
            key={p.id}
            data-slide
            className="w-[min(100%,20rem)] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <MarketplaceProjectCard project={p} />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between sm:flex",
          !canPrev && !canNext && "sm:hidden"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "pointer-events-auto -ml-2 h-10 w-10 rounded-full bg-card/95 shadow-sm backdrop-blur",
            !canPrev && "invisible"
          )}
          onClick={() => scrollByCard(-1)}
          aria-label={t("common.back")}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "pointer-events-auto -mr-2 h-10 w-10 rounded-full bg-card/95 shadow-sm backdrop-blur",
            !canNext && "invisible"
          )}
          onClick={() => scrollByCard(1)}
          aria-label={t("common.next")}
          disabled={!canNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
