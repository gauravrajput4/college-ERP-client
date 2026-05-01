import { useEffect, useRef } from "react";

const diffProps = (prevProps = {}, nextProps = {}) => {
  const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]);
  const changed = {};
  allKeys.forEach((key) => {
    if (!Object.is(prevProps[key], nextProps[key])) {
      changed[key] = { before: prevProps[key], after: nextProps[key] };
    }
  });
  return changed;
};

const useRenderCount = (componentName, propsSnapshot = {}) => {
  const countRef = useRef(0);
  const bucketRef = useRef({ start: Date.now(), count: 0 });
  const prevPropsRef = useRef(propsSnapshot);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    countRef.current += 1;
    const now = Date.now();
    const elapsed = now - bucketRef.current.start;
    if (elapsed > 1000) {
      bucketRef.current = { start: now, count: 0 };
    }
    bucketRef.current.count += 1;
    const changedProps = diffProps(prevPropsRef.current, propsSnapshot);

    // eslint-disable-next-line no-console
    console.log(`[render] ${componentName} #${countRef.current}`, changedProps);
    if (bucketRef.current.count > 5) {
      // eslint-disable-next-line no-console
      console.warn(`[render-warning] ${componentName} rendered ${bucketRef.current.count} times within 1s`);
    }
    prevPropsRef.current = propsSnapshot;
  });
};

export default useRenderCount;

