import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof STATUS_COLORS | "default" | "outline" | "destructive" | "gold";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClass =
    variant in STATUS_COLORS
      ? STATUS_COLORS[variant]
      : variant === "outline"
        ? "border border-border text-foreground bg-card"
        : variant === "destructive"
          ? "bg-destructive/10 text-destructive border border-destructive/20"
          : variant === "gold"
            ? "bg-warning/15 text-warning-foreground border border-warning/30"
            : "bg-primary/10 text-primary border border-primary/20";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClass,
        className
      )}
      {...props}
    />
  );
}
