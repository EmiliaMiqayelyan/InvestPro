import { cn } from "@/lib/utils";
import { FolderKanban } from "lucide-react";

interface ProjectImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ProjectImage({ src, alt, className }: ProjectImageProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn("object-cover w-full h-full", className)} />
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full bg-gradient-to-br from-brand-blue/30 to-emerald/30 flex items-center justify-center",
        className
      )}
    >
      <FolderKanban className="h-16 w-16 text-muted-foreground/50" />
    </div>
  );
}
