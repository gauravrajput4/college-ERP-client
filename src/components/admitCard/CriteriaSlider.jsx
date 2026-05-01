import { useEffect, useMemo, useState } from "react";

const toneClass = (value) => {
  if (value >= 60) return "text-emerald-600";
  if (value >= 40) return "text-amber-600";
  return "text-rose-600";
};

const CriteriaSlider = ({ label, helperText, value, onChange, estimatedEligibleCount, onDebouncedChange }) => {
  const [internalValue, setInternalValue] = useState(Number(value || 0));

  useEffect(() => {
    setInternalValue(Number(value || 0));
  }, [value]);

  useEffect(() => {
    if (!onDebouncedChange) return undefined;
    const timer = window.setTimeout(() => onDebouncedChange(internalValue), 350);
    return () => window.clearTimeout(timer);
  }, [internalValue, onDebouncedChange]);

  const labelTone = useMemo(() => toneClass(internalValue), [internalValue]);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        </div>
        <span className={`text-lg font-semibold ${labelTone}`}>{internalValue}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={internalValue}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          setInternalValue(nextValue);
          onChange?.(nextValue);
        }}
        className="mt-4 h-2 w-full cursor-pointer accent-indigo-600"
      />
      <p className="mt-3 text-xs text-slate-600">
        Estimated eligible students: <span className="font-semibold text-slate-900">{estimatedEligibleCount ?? "-"}</span>
      </p>
    </div>
  );
};

export default CriteriaSlider;
