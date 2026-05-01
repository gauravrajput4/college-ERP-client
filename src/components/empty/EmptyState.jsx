const sizeClass = {
  sm: "w-[120px] h-[96px]",
  md: "w-[160px] h-[128px]",
  lg: "w-[200px] h-[160px]",
};

const EmptyState = ({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className = "",
}) => {
  return (
    <div
      aria-live="polite"
      className={`empty-state-enter mx-auto flex min-h-[280px] max-w-xl flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 text-center shadow-card ${className}`}
      style={{
        "--empty-primary": "#3949ab",
        "--empty-secondary": "#f9a825",
        "--empty-accent": "#cbd5e1",
      }}
    >
      <div className={sizeClass[size] || sizeClass.md}>{illustration}</div>
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      <p className="max-w-[360px] text-sm text-slate-500">{description}</p>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {action.icon || null}
          {action.label}
        </button>
      ) : null}
      {secondaryAction ? (
        <button type="button" onClick={secondaryAction.onClick} className="text-sm font-semibold text-primary underline">
          {secondaryAction.label}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
