import { BoltIcon, DocumentIcon, LockIcon, ShieldIcon, StackIcon, TrendIcon, type IconProps } from "./index";

// Shared slug → icon mapping for ASSET_TYPES (lib/assets.ts), reused everywhere the asset
// directory is rendered (home, state pages) so the mapping only lives in one place.
const ICONS: Record<string, (props: IconProps) => React.ReactNode> = {
  "bank-accounts": StackIcon,
  insurance: ShieldIcon,
  wages: DocumentIcon,
  securities: TrendIcon,
  "utility-deposits": BoltIcon,
  "safe-deposit-boxes": LockIcon,
};

export function AssetIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? DocumentIcon;
  return <Icon className={className} />;
}
