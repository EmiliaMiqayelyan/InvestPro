"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BreadcrumbItem } from "@/components/shared/breadcrumbs";

type PageTitleState = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
};

type PageTitleContextValue = {
  pageTitle: PageTitleState;
  setPageTitle: (title: string, breadcrumbs?: BreadcrumbItem[]) => void;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

const EMPTY_BREADCRUMBS: BreadcrumbItem[] = [];

function breadcrumbsEqual(a: BreadcrumbItem[], b: BreadcrumbItem[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every(
    (item, i) => item.label === b[i].label && item.href === b[i].href
  );
}

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitleState] = useState<PageTitleState>({
    title: "",
    breadcrumbs: EMPTY_BREADCRUMBS,
  });

  const setPageTitle = useCallback(
    (title: string, breadcrumbs: BreadcrumbItem[] = EMPTY_BREADCRUMBS) => {
      setPageTitleState((prev) => {
        if (prev.title === title && breadcrumbsEqual(prev.breadcrumbs, breadcrumbs)) {
          return prev;
        }
        return { title, breadcrumbs };
      });
    },
    []
  );

  const value = useMemo(
    () => ({ pageTitle, setPageTitle }),
    [pageTitle, setPageTitle]
  );

  return (
    <PageTitleContext.Provider value={value}>{children}</PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const ctx = useContext(PageTitleContext);
  if (!ctx) {
    throw new Error("usePageTitle must be used within PageTitleProvider");
  }
  return ctx;
}

/** Call from page components to set workspace header title + breadcrumbs */
export function useSetPageTitle(
  title: string,
  breadcrumbs: BreadcrumbItem[] = EMPTY_BREADCRUMBS
) {
  const { setPageTitle } = usePageTitle();
  const crumbsRef = useRef(breadcrumbs);
  crumbsRef.current = breadcrumbs;
  const crumbsKey = breadcrumbs.map((b) => `${b.label}|${b.href ?? ""}`).join("\0");

  useEffect(() => {
    setPageTitle(title, crumbsRef.current);
  }, [title, crumbsKey, setPageTitle]);
}
