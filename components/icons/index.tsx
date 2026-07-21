// Small, hand-drawn icon set — a consistent 1.5px stroke on a 24x24 grid, used in place of
// unicode glyphs (✓, →, ↗) or a generic imported icon library, so recurring concepts (state,
// document, timeline, notarisation) read as part of Frifti's own visual language.

export type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 3.5h7l4 4V20a.75.75 0 0 1-.75.75H7A.75.75 0 0 1 6.25 20V4.25A.75.75 0 0 1 7 3.5Z" />
      <path d="M13.5 3.5V8h4.25M9 12.5h6M9 15.75h6M9 9.25h2.5" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.25 19 6v5.5c0 4.6-3 7.9-7 9.25-4-1.35-7-4.65-7-9.25V6l7-2.75Z" />
      <path d="M9 12l2 2 4-4.25" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M8.5 12.25l2.4 2.4L15.75 9.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 9.5 12 15l6-5.5" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function StackIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z" />
      <path d="M3.5 12l8.5 4.5L20.5 12M3.5 16l8.5 4.5L20.5 16" />
    </svg>
  );
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v18M8 21h8M5 7h6M13 7h6" />
      <path d="m5 7-3 6a3 3 0 0 0 6 0L5 7ZM19 7l-3 6a3 3 0 0 0 6 0l-3-6Z" />
    </svg>
  );
}

export function TrendIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 16.5 9.5 11l3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13l-.5-7.5Z" />
    </svg>
  );
}
