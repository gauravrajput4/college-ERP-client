import { Skeleton } from "boneyard/react";

const DASHBOARD_STATS_BONES = {
  breakpoints: {
    0: {
      name: "dashboard-stats",
      viewportWidth: 1200,
      width: 100,
      height: 430,
      bones: [
        [0, 16, 24, 110, 12],
        [25.3, 16, 24, 110, 12],
        [50.6, 16, 24, 110, 12],
        [75.9, 16, 24, 110, 12],
        [2, 34, 4, 48, 10],
        [8, 34, 7, 32, 8],
        [8, 74, 11, 14, 6],
        [8, 96, 7, 20, 20],
        [0, 152, 62, 260, 12],
        [64, 152, 36, 260, 12],
        [2, 176, 22, 16, 6],
        [2, 210, 58, 36, 8],
        [2, 255, 58, 36, 8],
        [2, 300, 58, 36, 8],
        [2, 345, 58, 36, 8],
        [66, 176, 16, 18, 6],
        [66, 206, 32, 180, 8],
      ],
    },
  },
};

const DashboardStatsSkeleton = () => {
  return (
    <Skeleton loading name="dashboard-stats" initialBones={DASHBOARD_STATS_BONES}>
      <div className="min-h-[430px] rounded-xl bg-white" />
    </Skeleton>
  );
};

DashboardStatsSkeleton.displayName = "DashboardStatsSkeleton";

export default DashboardStatsSkeleton;
