import { useEffect, useMemo, useState } from "react";
import { resolveImage } from "../utils/assetPaths";

function SafeImage({ image, alt, className, style, loading = "lazy" }) {
  const { primary, fallback } = useMemo(() => resolveImage(image), [image]);
  const [src, setSrc] = useState(primary);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setSrc(primary);
    setFallbackUsed(false);
    setHasFailed(false);
  }, [primary, fallback]);

  const handleError = () => {
    if (!fallbackUsed && fallback) {
      setSrc(fallback);
      setFallbackUsed(true);
      return;
    }

    setHasFailed(true);
  };

  if (!src || hasFailed) {
    return <div className={`img-fallback ${className || ""}`.trim()} style={style} aria-label={alt} role="img" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      onError={handleError}
    />
  );
}

export default SafeImage;
