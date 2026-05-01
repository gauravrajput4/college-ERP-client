const EmptyStudentsIllustration = () => {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="No students available">
      <title>No students available</title>
      <rect x="24" y="116" width="152" height="24" rx="12" fill="none" stroke="var(--empty-accent)" strokeDasharray="5 4" />
      <path d="M28 62L100 32L172 62L100 90L28 62Z" fill="var(--empty-primary)" />
      <rect x="94" y="88" width="12" height="20" rx="2" fill="var(--empty-primary)" />
      <path d="M140 62V94" stroke="var(--empty-secondary)" strokeWidth="4" />
      <circle cx="140" cy="100" r="6" fill="var(--empty-secondary)" />
      <circle cx="100" cy="108" r="20" fill="var(--empty-accent)" opacity="0.35" />
    </svg>
  );
};

export default EmptyStudentsIllustration;
