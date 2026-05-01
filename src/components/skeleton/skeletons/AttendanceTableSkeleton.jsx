import { Skeleton } from "boneyard/react";
import { SKELETON_DEFAULTS } from "../../../lib/boneyard.config";

const ATTENDANCE_BONES = {
  breakpoints: {
    0: {
      name: "attendance-table",
      viewportWidth: 1200,
      width: 100,
      height: 360,
      bones: [
        [0, 10, 18, 16, SKELETON_DEFAULTS.borderRadius],
        [22, 10, 70, 16, SKELETON_DEFAULTS.borderRadius],
        [0, 42, 100, 250, SKELETON_DEFAULTS.borderRadius],
        [2, 56, 16, 16, SKELETON_DEFAULTS.borderRadius],
        [22, 52, 2.8, 28, "50%"],
        [26, 52, 2.8, 28, "50%"],
        [30, 52, 2.8, 28, "50%"],
        [34, 52, 2.8, 28, "50%"],
        [38, 52, 2.8, 28, "50%"],
        [42, 52, 2.8, 28, "50%"],
        [46, 52, 2.8, 28, "50%"],
        [50, 52, 2.8, 28, "50%"],
        [54, 52, 2.8, 28, "50%"],
        [58, 52, 2.8, 28, "50%"],
        [62, 52, 2.8, 28, "50%"],
        [66, 52, 2.8, 28, "50%"],
        [70, 52, 2.8, 28, "50%"],
        [74, 52, 2.8, 28, "50%"],
        [78, 52, 2.8, 28, "50%"],
        [82, 52, 2.8, 28, "50%"],
        [86, 52, 8, 16, SKELETON_DEFAULTS.borderRadius],
        [2, 92, 16, 16, SKELETON_DEFAULTS.borderRadius],
        [2, 128, 16, 16, SKELETON_DEFAULTS.borderRadius],
        [2, 164, 16, 16, SKELETON_DEFAULTS.borderRadius],
        [2, 200, 16, 16, SKELETON_DEFAULTS.borderRadius],
        [2, 236, 16, 16, SKELETON_DEFAULTS.borderRadius],
        [0, 308, 100, 24, SKELETON_DEFAULTS.borderRadius],
      ],
    },
  },
};

const AttendanceTableSkeleton = () => {
  return (
    <Skeleton loading name="attendance-table" initialBones={ATTENDANCE_BONES}>
      <div className="min-h-[360px] rounded-xl bg-white" />
    </Skeleton>
  );
};

AttendanceTableSkeleton.displayName = "AttendanceTableSkeleton";

export default AttendanceTableSkeleton;
