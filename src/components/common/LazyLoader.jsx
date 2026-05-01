import { Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import PageSkeleton from "./PageSkeleton";

const DelayedFallback = ({ minDelay, fallback }) => {
  const [show, setShow] = useState(minDelay <= 0);

  useEffect(() => {
    if (minDelay <= 0) return undefined;
    const timer = window.setTimeout(() => setShow(true), minDelay);
    return () => window.clearTimeout(timer);
  }, [minDelay]);

  return show ? fallback : null;
};

const LazyLoader = ({ children, fallback = <PageSkeleton />, minDelay = 120 }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DelayedFallback minDelay={minDelay} fallback={fallback} />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default LazyLoader;

