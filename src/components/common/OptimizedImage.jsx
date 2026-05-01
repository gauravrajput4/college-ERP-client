import { useEffect, useMemo, useRef, useState } from "react";
import { getOptimizedUrl } from "../../utils/cloudinaryUrl";

const getInitials = (alt = "") =>
  alt
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("") || "NA";

const withWebp = (url = "") => {
  if (!url) return "";
  if (url.includes("/f_auto")) return url;
  return url.replace("/upload/", "/upload/f_webp/");
};

const with2x = (url = "") => {
  if (!url) return "";
  if (url.includes("dpr_auto")) return `${url} 1x, ${url} 2x`;
  return `${url} 1x, ${url} 2x`;
};

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholder = "",
  fallbackText,
  cloudinaryPublicId,
  onLoad,
  ...rest
}) => {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const imageSrc = useMemo(() => {
    if (src) return src;
    if (!cloudinaryPublicId) return "";
    try {
      return getOptimizedUrl(cloudinaryPublicId, { width });
    } catch {
      return "";
    }
  }, [cloudinaryPublicId, src, width]);

  const showImage = inView || rest.loading === "eager";
  const initialText = fallbackText || getInitials(alt);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, backgroundColor: "#e2e8f0" }}
      aria-label={alt}
    >
      {!loaded && placeholder ? (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-md transition-opacity duration-300"
        />
      ) : null}

      {failed || !imageSrc ? (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-bold text-primary">
          {initialText}
        </div>
      ) : null}

      {showImage && !failed ? (
        <picture>
          <source srcSet={with2x(withWebp(imageSrc))} type="image/webp" />
          <img
            src={imageSrc}
            srcSet={with2x(imageSrc)}
            alt={alt}
            width={width}
            height={height}
            loading={rest.loading || "lazy"}
            onLoad={(event) => {
              setLoaded(true);
              onLoad?.(event);
            }}
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover transition duration-300 ${loaded ? "opacity-100 blur-0" : "opacity-70 blur-sm"}`}
            {...rest}
          />
        </picture>
      ) : null}
    </div>
  );
};

export default OptimizedImage;
