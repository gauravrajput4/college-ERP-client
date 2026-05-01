export const SKELETON_DEFAULTS = {
  baseColor: "#1e1e2e",
  highlightColor: "#2a2a3e",
  animation: "wave",
  speed: 1.5,
  direction: "ltr",
  borderRadius: "6px",
};

export const BONEYARD_THEME = {
  color: SKELETON_DEFAULTS.baseColor,
  darkColor: "#181825",
  shimmerColor: SKELETON_DEFAULTS.highlightColor,
  darkShimmerColor: "#313244",
  animate: "shimmer",
  speed: `${SKELETON_DEFAULTS.speed}s`,
  shimmerAngle: 110,
};
