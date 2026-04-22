import { useMemo, useState } from "react";
import { getAttendance } from "../../api/student.api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";

const Attendance = () => {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const attendanceState = useFetch(() => getAttendance({ month, year }), [month, year]);

  const calendarItems = useMemo(() => attendanceState.data?.attendance || [], [attendanceState.data]);
  const summary = attendanceState.data?.summary || {};

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl text-primary">Attendance</h1>
      <div className="flex gap-3 rounded-xl bg-white p-4 shadow-card">
        <input className="rounded border" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" />
        <input className="rounded border" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
      </div>

      {attendanceState.loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-2 rounded-xl bg-white p-5 shadow-card sm:grid-cols-2 md:grid-cols-7">
            {calendarItems.map((item) => (
              <div
                key={item._id}
                className={`rounded p-2 text-xs text-white ${
                  item.status === "Present" ? "bg-emerald-500" : item.status === "Absent" ? "bg-rose-500" : "bg-amber-500"
                }`}
              >
                {new Date(item.date).toLocaleDateString()} - {item.status}
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card">
            <h2 className="text-lg font-semibold text-primary">Summary</h2>
            <p className="mt-2 text-sm text-slate-700">
              Present: {summary.present || 0} | Absent: {summary.absent || 0} | Leave: {summary.leave || 0} |
              Percentage: {summary.percentage || 0}%
            </p>
            {Number(summary.percentage || 0) < 75 && (
              <div className="mt-3 rounded bg-amber-100 p-3 text-sm text-amber-700">
                Warning: Attendance below 75%.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;
