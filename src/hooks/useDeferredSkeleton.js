import { useEffect, useState, useTransition } from "react";

const useDeferredSkeleton = (isLoading, delay = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSkeleton(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setShowSkeleton(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, isLoading]);

  return showSkeleton;
};

export const useDeferredSkeletonTransition = (isLoading, delay = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isLoading) {
      startTransition(() => setShowSkeleton(false));
      return undefined;
    }

    const timer = window.setTimeout(() => {
      startTransition(() => setShowSkeleton(true));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [delay, isLoading, startTransition]);

  return showSkeleton;
};

export default useDeferredSkeleton;
