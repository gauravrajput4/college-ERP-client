import { Skeleton } from "boneyard/react";
import { SKELETON_DEFAULTS } from "../../../lib/boneyard.config";

const NOTICE_BONES = {
  breakpoints: {
    0: {
      name: "notice-board",
      viewportWidth: 1200,
      width: 100,
      height: 460,
      bones: [
        [0, 20, 31.5, 200, 12],
        [34.2, 20, 31.5, 200, 12],
        [68.4, 20, 31.5, 200, 12],
        [2, 34, 8, 20, SKELETON_DEFAULTS.borderRadius],
        [2, 66, 20, 18, SKELETON_DEFAULTS.borderRadius],
        [2, 90, 16, 18, SKELETON_DEFAULTS.borderRadius],
        [2, 116, 27, 1, 0],
        [2, 132, 26, 14, SKELETON_DEFAULTS.borderRadius],
        [2, 152, 25, 14, SKELETON_DEFAULTS.borderRadius],
        [2, 172, 18, 14, SKELETON_DEFAULTS.borderRadius],
        [2, 192, 9, 14, SKELETON_DEFAULTS.borderRadius],
        [0, 240, 31.5, 200, 12],
        [34.2, 240, 31.5, 200, 12],
        [68.4, 240, 31.5, 200, 12],
      ],
    },
  },
};

const NoticeBoardSkeleton = () => {
  return (
    <Skeleton loading name="notice-board" initialBones={NOTICE_BONES}>
      <div className="min-h-[460px] rounded-xl bg-white" />
    </Skeleton>
  );
};

NoticeBoardSkeleton.displayName = "NoticeBoardSkeleton";

export default NoticeBoardSkeleton;
