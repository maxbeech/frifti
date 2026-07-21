// Single source of truth for the primary nav links, shared between the desktop <nav> in
// app/layout.tsx (a Server Component) and components/MobileNav.tsx (a Client Component) —
// kept in its own plain module rather than exported from MobileNav.tsx because everything
// exported from a "use client" file becomes a client reference, which broke importing this
// array into the server-rendered layout.
export const NAV_LINKS = [
  { href: "/#states", label: "States" },
  { href: "/blog", label: "Guides" },
  { href: "/missingmoney-alternative", label: "vs MissingMoney" },
];
