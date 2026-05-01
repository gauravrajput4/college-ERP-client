import { useEffect } from "react";
import { configureBoneyard } from "boneyard/react";
import { BONEYARD_THEME } from "../../lib/boneyard.config";

const SkeletonThemeProvider = ({ children }) => {
  useEffect(() => {
    configureBoneyard(BONEYARD_THEME);
  }, []);

  return children;
};

export default SkeletonThemeProvider;
