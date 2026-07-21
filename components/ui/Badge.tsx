type Tone = "lime" | "ink" | "outline";

const TONE_CLASSES: Record<Tone, string> = {
  lime: "bg-lime text-ink",
  ink: "bg-ink text-white",
  outline: "border border-line-strong text-body",
};

export function Badge({ tone = "lime", className = "", children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${TONE_CLASSES[tone]} ${className}`}>
      {children}
    </span>
  );
}
