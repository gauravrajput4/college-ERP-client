import { Skeleton } from "boneyard/react";

const STUDENT_DASHBOARD_BONES = {
  breakpoints: {
    0: {
      name: "student-dashboard",
      viewportWidth: 1200,
      width: 100,
      height: 520,
      bones: [
        [0, 16, 100, 190, 12],
        [3, 40, 16, 140, "50%"],
        [8, 65, 6, 90, "50%"],
        [22, 38, 24, 42, 10],
        [22, 88, 24, 42, 10],
        [22, 138, 24, 42, 10],
        [0, 224, 100, 190, 12],
        [3, 246, 30, 80, 10],
        [35, 246, 30, 80, 10],
        [67, 246, 30, 80, 10],
        [3, 332, 30, 80, 10],
        [35, 332, 30, 80, 10],
        [67, 332, 30, 80, 10],
        [0, 430, 100, 80, 12],
        [3, 450, 70, 12, 6],
        [3, 470, 62, 12, 6],
        [3, 490, 48, 12, 6],
      ],
    },
  },
};

const StudentDashboardSkeleton = () => {
  return (
    <Skeleton loading name="student-dashboard" initialBones={STUDENT_DASHBOARD_BONES}>
      <div className="min-h-[520px] rounded-xl bg-white" />
    </Skeleton>
  );
};

StudentDashboardSkeleton.displayName = "StudentDashboardSkeleton";

export default StudentDashboardSkeleton;
