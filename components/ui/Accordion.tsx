"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDownIcon } from "@/components/icons";

export type AccordionItem = { q: string; a: string };

/** Single-open FAQ accordion — replaces the site's old "every question is its own bordered
 * card" treatment, which gave FAQ sections no visual identity distinct from a feature grid. */
export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg text-ink">{item.q}</span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-body">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
