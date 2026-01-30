"use client";

type WizardFooterProps = {
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
};

export default function WizardFooter({
  backLabel = "Back",
  nextLabel = "Next",
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
}: WizardFooterProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-white">
      <div className="border-t border-gray-200" />
      <div className="h-20 px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="text-sm font-semibold text-gray-900 underline underline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {backLabel}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="px-6 py-3 rounded-lg bg-black text-white text-sm font-semibold hover:bg-black/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {nextLabel}
        </button>
      </div>
    </footer>
  );
}
