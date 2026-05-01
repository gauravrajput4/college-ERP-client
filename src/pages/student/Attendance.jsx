import { useContext, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { getDailyAttendance } from "../../api/student.api";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import { EmptyAttendance } from "../../components/empty";
import { AttendanceTableSkeleton, SkeletonWrapper } from "../../components/skeleton";
import useDeferredSkeleton from "../../hooks/useDeferredSkeleton";
import { AuthContext } from "../../context/AuthContext";

const Attendance = () => {
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const apiDate = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);
  const attendanceState = useFetch(() => getDailyAttendance(apiDate), [apiDate]);

  const daily = attendanceState.data?.data || attendanceState.data;
  const subjects = useMemo(() => daily?.subjects || [], [daily]);
  const status = daily?.status || null;
  const showSkeleton = useDeferredSkeleton(attendanceState.loading, 300);

  const badgeClass = (value) => {
    if (value === "Present") return "bg-emerald-100 text-emerald-800";
    if (value === "Absent") return "bg-rose-100 text-rose-800";
    if (value === "Leave") return "bg-amber-100 text-amber-800";
    if (value === "Holiday") return "bg-slate-100 text-slate-800";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Attendance</h1>
      <div className="rounded-xl bg-white p-4 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-700">Select Date</div>
          <div className="w-full sm:w-auto">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-[220px]"
              popperPlacement="bottom-end"
              showPopperArrow={false}
            />
          </div>
        </div>
      </div>

      {showSkeleton ? (
        <SkeletonWrapper loading>
          <AttendanceTableSkeleton />
        </SkeletonWrapper>
      ) : attendanceState.error ? (
        <ErrorState error={attendanceState.error} onRetry={attendanceState.execute} onGoHome={() => navigate("/student")} />
      ) : !subjects.length ? (
        <EmptyAttendance
          userRole={role}
          date={format(selectedDate, "dd/MM/yyyy")}
          onMark={() => navigate("/teacher/attendance")}
          onViewTimetable={() => navigate("/student/timetable")}
        />
      ) : (
        <div className="rounded-xl bg-white p-5 shadow-card">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-slate-500">Date</div>
              <div className="text-lg font-semibold text-primary">{format(selectedDate, "dd/MM/yyyy")}</div>
            </div>
            {status ? (
              <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(status)}`}>
                {status}
              </span>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {subjects.map((row) => (
              <div key={`${row.subject}-${row.time || ""}`} className="flex flex-col gap-2 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-800">{row.subject}</div>
                  {row.time ? <div className="mt-1 text-sm text-slate-500">{row.time}</div> : null}
                </div>
                <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(row.status)}`}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
