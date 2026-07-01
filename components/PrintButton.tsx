"use client";

// Lets the buyer save their delivered kit as a PDF via the browser's print-to-PDF.
// Client-only because it calls window.print(); hidden from the printout via print:hidden.
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 print:hidden"
    >
      Save / print this kit (PDF) →
    </button>
  );
}
