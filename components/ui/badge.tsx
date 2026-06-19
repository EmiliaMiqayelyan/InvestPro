import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof STATUS_COLORS | "default" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClass =
    variant in STATUS_COLORS
      ? STATUS_COLORS[variant]
      : variant === "outline"
        ? "border border-border text-foreground"
        : "bg-primary/20 text-primary border border-primary/30";

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
