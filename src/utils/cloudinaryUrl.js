const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const ensureCloudinary = () => {
  if (!cloudName) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME.");
  }
};

export const getOptimizedUrl = (publicId, options = {}) => {
  if (!publicId) return "";
  ensureCloudinary();
  const {
    width = 300,
    quality = "auto",
    format = "auto",
    crop = "fill",
    dpr = "auto",
  } = options;
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_${format},q_${quality},w_${width},c_${crop},dpr_${dpr}/${publicId}`;
};

export const getAvatarUrl = (publicId, size = 100) => {
  return getOptimizedUrl(publicId, { width: size, crop: "fill", quality: "auto", format: "auto" });
};

export const getThumbnailUrl = (publicId) => {
  return getOptimizedUrl(publicId, { width: 240, crop: "fill", quality: "auto", format: "auto" });
};

