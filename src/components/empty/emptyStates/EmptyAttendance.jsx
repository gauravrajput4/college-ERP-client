import EmptyState from "../EmptyState";
import EmptyAttendanceIllustration from "../illustrations/EmptyAttendanceIllustration";

const EmptyAttendance = ({ userRole, date, onMark, onViewTimetable }) => {
  if (userRole === "Admin" || userRole === "Teacher") {
    return (
      <EmptyState
        illustration={<EmptyAttendanceIllustration />}
        title={`No attendance for ${date}`}
        description="Mark today's attendance to keep records up to date."
        action={{ label: "Mark Attendance Now", onClick: onMark }}
      />
    );
  }

  return (
    <EmptyState
      illustration={<EmptyAttendanceIllustration />}
      title="No attendance records"
      description="Your attendance will appear here once your faculty marks it for your class."
      action={{ label: "View Timetable", onClick: onViewTimetable }}
    />
  );
};

export default EmptyAttendance;
