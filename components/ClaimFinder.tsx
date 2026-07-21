"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { STATES } from "@/lib/states";
import { ASSET_TYPES } from "@/lib/assets";
import { buildClaimPlan, type OwnerStatus } from "@/lib/claims";
import { ClaimKitCta } from "@/components/ClaimKitCta";
import { PartnerOffers } from "@/components/PartnerOffers";
import { Button } from "@/components/ui/Button";
import { CheckIcon, ClockIcon, DocumentIcon, ShieldIcon } from "@/components/icons";

const OWNER_LABELS: Record<OwnerStatus, string> = {
  self: "Myself",
  business: "A business I represent",
  heir: "A deceased relative (I'm an heir or executor)",
};

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-lime/60";

export function ClaimFinder({ initialState, initialAsset }: { initialState?: string; initialAsset?: string }) {
  const [stateSlug, setStateSlug] = useState(initialState ?? "");
  const [assetSlug, setAssetSlug] = useState(initialAsset ?? "bank-accounts");
  const [value, setValue] = useState("");
  const [owner, setOwner] = useState<OwnerStatus>("self");
  const reduceMotion = useReducedMotion();

  const plan = useMemo(() => {
    if (!stateSlug) return null;
    return buildClaimPlan({
      stateSlug,
      assetSlug,
      estimatedValue: value ? Number(value) : 0,
      ownerStatus: owner,
    });
  }, [stateSlug, assetSlug, value, owner]);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-left shadow-xl shadow-black/10 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Which state held the property?</span>
          <select value={stateSlug} onChange={(e) => setStateSlug(e.target.value)} className={fieldClass}>
            <option value="">Select a state…</option>
            {STATES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">What type of property?</span>
          <select value={assetSlug} onChange={(e) => setAssetSlug(e.target.value)} className={fieldClass}>
            {ASSET_TYPES.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Estimated amount (optional)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 500"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Who are you claiming for?</span>
          <select value={owner} onChange={(e) => setOwner(e.target.value as OwnerStatus)} className={fieldClass}>
            {(Object.keys(OWNER_LABELS) as OwnerStatus[]).map((k) => (
              <option key={k} value={k}>{OWNER_LABELS[k]}</option>
            ))}
          </select>
        </label>
      </div>

      {!plan && <p className="mt-5 text-sm text-muted">Pick a state above to generate your free claim checklist.</p>}

      <AnimatePresence initial={false}>
        {plan && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 border-t border-line pt-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button href={plan.portal} variant="primary" icon="external">
                Search the official {plan.state.name} portal
              </Button>
              <span className="text-xs text-muted">{plan.state.agency} · always free to claim</span>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <ClockIcon className="h-4 w-4" /> Your claim at a glance
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-body">
                  <li><span className="font-medium text-ink">Property type:</span> {plan.asset.name}</li>
                  <li><span className="font-medium text-ink">Complexity:</span> <span className="capitalize">{plan.complexity}</span></li>
                  <li>
                    <span className="font-medium text-ink">Typical timeline:</span>{" "}
                    {plan.timelineWeeks.min}–{plan.timelineWeeks.max} weeks after a complete claim
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ShieldIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium text-ink">Notarized form:</span>{" "}
                    {plan.notarizationLikely ? "Likely required" : "Usually not required"}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <DocumentIcon className="h-4 w-4" /> Documents to gather
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-body">
                  {plan.documents.map((d) => (
                    <li key={d} className="flex gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ol className="mt-6 space-y-2.5 text-sm text-body">
              {plan.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>

            <ClaimKitCta plan={plan} value={value ? Number(value) : 0} ownerStatus={owner} />
            <PartnerOffers plan={plan} value={value ? Number(value) : 0} ownerStatus={owner} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
