import { Skeleton } from "boneyard/react";
import { SKELETON_DEFAULTS } from "../../../lib/boneyard.config";

const STUDENT_ROWS = {
  breakpoints: {
    0: {
      name: "students-table",
      viewportWidth: 1200,
      width: 100,
      height: 430,
      bones: [
        [0, 14, 8, 16, SKELETON_DEFAULTS.borderRadius],
        [10, 14, 24, 16, SKELETON_DEFAULTS.borderRadius],
        [36, 14, 14, 16, SKELETON_DEFAULTS.borderRadius],
        [52, 14, 15, 16, SKELETON_DEFAULTS.borderRadius],
        [70, 14, 10, 16, SKELETON_DEFAULTS.borderRadius],
        [82, 14, 14, 16, SKELETON_DEFAULTS.borderRadius],
        [0, 52, 96, 48, SKELETON_DEFAULTS.borderRadius],
        [2, 60, 2.7, 32, "50%"],
        [6, 66, 18, 14, SKELETON_DEFAULTS.borderRadius],
        [36, 66, 10, 14, SKELETON_DEFAULTS.borderRadius],
        [52, 66, 12, 14, SKELETON_DEFAULTS.borderRadius],
        [70, 66, 8, 20, 20],
        [82, 62, 6, 16, SKELETON_DEFAULTS.borderRadius],
        [89, 62, 6, 16, SKELETON_DEFAULTS.borderRadius],
        [0, 108, 96, 48, SKELETON_DEFAULTS.borderRadius],
        [0, 164, 96, 48, SKELETON_DEFAULTS.borderRadius],
        [0, 220, 96, 48, SKELETON_DEFAULTS.borderRadius],
        [0, 276, 96, 48, SKELETON_DEFAULTS.borderRadius],
        [0, 332, 96, 48, SKELETON_DEFAULTS.borderRadius],
      ],
    },
  },
};

const StudentsTableSkeleton = () => {
  return (
    <Skeleton loading name="students-table" initialBones={STUDENT_ROWS}>
      <div className="min-h-[430px] rounded-xl bg-white" />
    </Skeleton>
  );
};

StudentsTableSkeleton.displayName = "StudentsTableSkeleton";

export default StudentsTableSkeleton;
