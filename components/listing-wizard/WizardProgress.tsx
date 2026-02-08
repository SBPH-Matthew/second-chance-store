"use client";

type WizardProgressProps = {
  value: number; // 0-100
};

export default function WizardProgress({ value }: WizardProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1 bg-gray-200" aria-hidden="true">
      <div
        className="h-full bg-black transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
