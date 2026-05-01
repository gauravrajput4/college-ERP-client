const SkeletonWrapper = ({ loading, children }) => {
  return (
    <section
      role="status"
      aria-label="Loading content"
      aria-live="polite"
      aria-busy={loading ? "true" : "false"}
      data-loading={loading ? "true" : "false"}
    >
      <div aria-hidden={loading ? "true" : undefined}>{children}</div>
    </section>
  );
};

export default SkeletonWrapper;
