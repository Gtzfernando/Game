"use client";

import { useState } from "react";
import { InstructionsModal } from "./instructions-modal";

export function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-moss text-white shadow-warm transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2"
        aria-label="Ver instrucciones"
        type="button"
      >
        <span className="text-2xl">❓</span>
      </button>
      <InstructionsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
