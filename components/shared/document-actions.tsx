"use client";

import { Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks";
import { documentDownloadHref, documentOpenHref } from "@/utils/document-url";

type DocumentActionsProps = {
  url?: string | null;
  name?: string;
  size?: "sm" | "default";
  showDownload?: boolean;
  openLabel?: string;
  downloadLabel?: string;
};

export function DocumentActions({
  url,
  name,
  size = "sm",
  showDownload = true,
  openLabel,
  downloadLabel,
}: DocumentActionsProps) {
  const { t } = useI18n();
  const openHref = documentOpenHref(url);
  const downloadHref = documentDownloadHref(url);

  const unavailable = () => {
    toast.error(t("common.fileUnavailable"));
  };

  return (
    <div className="flex gap-2">
      {openHref ? (
        <Button asChild size={size} variant="outline">
          <a href={openHref} target="_blank" rel="noreferrer">
            {openLabel || t("admin.openDocument")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      ) : (
        <Button size={size} variant="outline" onClick={unavailable}>
          {openLabel || t("admin.openDocument")}
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      )}
      {showDownload ? (
        downloadHref ? (
          <Button asChild size={size} variant="ghost">
            <a href={downloadHref} download={name || true}>
              {downloadLabel || t("admin.downloadDocument")}
              <Download className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : (
          <Button size={size} variant="ghost" onClick={unavailable}>
            {downloadLabel || t("admin.downloadDocument")}
            <Download className="h-3.5 w-3.5" />
          </Button>
        )
      ) : null}
    </div>
  );
}
