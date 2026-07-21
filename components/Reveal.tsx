"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Stagger delay in seconds — pass an index * 0.06 or similar for lists of Reveals. */
  delay?: number;
  as?: "div" | "section";
  /**
   * "view" (default): animate in via `whileInView` once the element scrolls into the
   * viewport — for content that starts off-screen. "mount": animate in immediately via
   * `animate`, no IntersectionObserver involved — for content that's already in the
   * viewport at load (e.g. the hero), where `whileInView`'s first-paint intersection check
   * is unreliable and can leave the element stuck at `opacity: 0` until the user scrolls.
   */
  trigger?: "view" | "mount";
};

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0 },
};

/** Fades/slides content in. A no-op (renders instantly, no motion) under
 * prefers-reduced-motion. Used sparingly — section entrances and card grids, not every
 * element on the page. */
export function Reveal({ children, className, id, delay = 0, as = "div", trigger = "view" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return (
      <Static id={id} className={className}>
        {children}
      </Static>
    );
  }

  const timing = { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (trigger === "mount") {
    return (
      <Component id={id} className={className} initial="hidden" animate="shown" variants={variants} transition={timing}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={timing}
    >
      {children}
    </Component>
  );
}
