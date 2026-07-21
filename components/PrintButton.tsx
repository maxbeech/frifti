"use client";

import { Button } from "@/components/ui/Button";

// Lets the buyer save their delivered kit as a PDF via the browser's print-to-PDF.
// Client-only because it calls window.print(); hidden from the printout via print:hidden.
export function PrintButton() {
  return (
    <Button type="button" size="sm" onClick={() => window.print()} className="print:hidden">
      Save or print this kit (PDF)
    </Button>
  );
}
