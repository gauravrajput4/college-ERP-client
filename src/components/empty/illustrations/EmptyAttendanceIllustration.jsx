const EmptyAttendanceIllustration = () => {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="No attendance records">
      <title>No attendance records</title>
      <rect x="34" y="20" width="132" height="112" rx="10" fill="white" stroke="var(--empty-accent)" />
      <rect x="34" y="20" width="132" height="24" rx="10" fill="var(--empty-primary)" />
      <rect x="52" y="58" width="18" height="18" rx="3" fill="var(--empty-accent)" />
      <rect x="80" y="58" width="18" height="18" rx="3" fill="var(--empty-accent)" />
      <rect x="108" y="58" width="18" height="18" rx="3" fill="var(--empty-accent)" />
      <rect x="136" y="58" width="18" height="18" rx="3" fill="none" stroke="var(--empty-secondary)" strokeWidth="2" />
      <text x="100" y="108" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--empty-secondary)">
        ?
      </text>
      <rect x="148" y="112" width="18" height="18" rx="4" fill="none" stroke="var(--empty-accent)" strokeDasharray="3 3" />
    </svg>
  );
};

export default EmptyAttendanceIllustration;
