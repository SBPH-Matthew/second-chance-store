"use client";

import Link from "next/link";

type WizardNavProps = {
  onSaveExit?: () => void;
  onQuestions?: () => void;
};

export default function WizardNav({ onSaveExit, onQuestions }: WizardNavProps) {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="h-20 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <span className="font-poppins font-bold text-[#1A1A1A] tracking-tight">
            Second Chance
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onQuestions}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Questions?
          </button>
          <button
            type="button"
            onClick={onSaveExit}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Save &amp; exit
          </button>
        </div>
      </div>
      <div className="border-b border-gray-200" />
    </header>
  );
}
