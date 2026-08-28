"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitleState] = useState<PageTitleState>({
    title: "",
    breadcrumbs: [],
  });

  const setPageTitle = useCallback((title: string, breadcrumbs: BreadcrumbItem[] = []) => {
    setPageTitleState({ title, breadcrumbs });
  }, []);

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
export function useSetPageTitle(title: string, breadcrumbs: BreadcrumbItem[] = []) {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle(title, breadcrumbs);
  }, [title, breadcrumbs, setPageTitle]);
}
