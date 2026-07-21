import Link from "next/link";
import { ArrowIcon, ExternalIcon } from "@/components/icons";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:bg-lime-strong",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:bg-bg",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
};

export type ButtonProps = {
  href?: string;
  variant?: Variant;
  size?: Size;
  /** Trailing icon affordance — replaces the site's old "→"/"↗" unicode-glyph convention. */
  icon?: "arrow" | "external" | false;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
};

export function Button({ href, variant = "primary", size = "md", icon = "arrow", className = "", children, onClick, type = "button", ...rest }: ButtonProps) {
  const classes = `group inline-flex items-center gap-1.5 rounded-lg font-semibold transition-colors duration-150 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
  const iconClass = "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5";
  const content = (
    <>
      <span>{children}</span>
      {icon === "arrow" && <ArrowIcon className={iconClass} />}
      {icon === "external" && <ExternalIcon className={iconClass} />}
    </>
  );

  if (!href) {
    return (
      <button type={type} onClick={onClick} className={classes} {...rest}>
        {content}
      </button>
    );
  }

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }

  if (href.startsWith("/api/")) {
    // Route handlers (e.g. /api/checkout) 303-redirect to Stripe or back to /premium — a
    // plain anchor forces a full browser navigation instead of Next's client-side router,
    // which would otherwise try to resolve /api/* as a page transition.
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
