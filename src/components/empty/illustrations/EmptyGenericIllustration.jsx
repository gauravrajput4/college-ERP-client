const EmptyGenericIllustration = () => {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="No records available">
      <title>No records available</title>
      <path d="M34 62L100 38L166 62V124H34V62Z" fill="var(--empty-accent)" opacity="0.35" />
      <path d="M34 62L100 86L166 62" fill="none" stroke="var(--empty-primary)" strokeWidth="4" />
      <path d="M34 62V124H166V62" fill="none" stroke="var(--empty-primary)" strokeWidth="4" />
      <rect x="74" y="102" width="52" height="12" rx="6" fill="var(--empty-secondary)" opacity="0.8" />
    </svg>
  );
};

export default EmptyGenericIllustration;
