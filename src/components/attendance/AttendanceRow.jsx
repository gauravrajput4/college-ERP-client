import { memo } from "react";

const AttendanceRow = ({ student, status, onStatusChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-between rounded border p-3">
      <span className="font-semibold text-slate-700">{student.userId?.name}</span>
      <div className="flex gap-2">
        {["Present", "Absent", "Leave"].map((value) => (
          <button
            key={value}
            onClick={() => onStatusChange(student._id, value)}
            className={`rounded px-3 py-1 text-sm ${status === value ? "bg-primary text-white" : "bg-slate-100"}`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(
  AttendanceRow,
  (prevProps, nextProps) =>
    prevProps.student._id === nextProps.student._id &&
    prevProps.student.date === nextProps.student.date &&
    prevProps.status === nextProps.status,
);

