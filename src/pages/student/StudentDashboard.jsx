import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getAttendance, getDashboard, getExams, getFees, getResults, getTimetable } from "../../api/student.api";
import Loader from "../../components/Loader";
import UpcomingLectureCard from "../../components/UpcomingLectureCard";
import useFetch from "../../hooks/useFetch";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  getLectureStatus,
  getNextLecture,
  getStatusClasses,
  getTodayLectures,
  sortTimetableEntries,
  formatTimeLabel,
} from "../../utils/timetable";

const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const StudentDashboard = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const today = now.getDate();
  const isCurrentMonth = now.getMonth() + 1 === month && now.getFullYear() === year;

  const dashboardState = useFetch(getDashboard, []);
  const attendanceState = useFetch(() => getAttendance({ month, year }), []);
  const feesState = useFetch(getFees, []);
  const resultsState = useFetch(() => getResults({ examType: "Mid-Term" }), []);
  const examsState = useFetch(getExams, []);
  const timetableState = useFetch(() => getTimetable(), []);

  const data = dashboardState.data || {};
  const profile = data.profile || {};
  const stats = data.stats || {};
  const attendanceSummary = attendanceState.data?.summary || {};
  const feeData = feesState.data || {};
  const results = resultsState.data?.results || [];
  const upcomingExam = (examsState.data || [])[0] || null;
  const timetableEntries = sortTimetableEntries(timetableState.data || []);
  const nextLecture = getNextLecture(timetableEntries);
  const todayLectures = getTodayLectures(timetableEntries);

  const pendingFee = Number(feeData.pendingAmount ?? stats.pendingFees ?? 0);
  const dueDate = feeData.dueDate ? new Date(feeData.dueDate).toLocaleDateString() : "Not available";

  const topResult = useMemo(() => {
    if (!results.length) return null;
    return results.reduce((best, item) => {
      const itemPct = item.maxMarks ? (item.marksObtained / item.maxMarks) * 100 : 0;
      const bestPct = best.maxMarks ? (best.marksObtained / best.maxMarks) * 100 : 0;
      return itemPct > bestPct ? item : best;
    }, results[0]);
  }, [results]);

  const topResultPercent = topResult?.maxMarks
    ? Math.round((topResult.marksObtained / topResult.maxMarks) * 100)
    : 0;

  const calendarCells = useMemo(() => {
    const statusByDay = new Map(
      (attendanceState.data?.attendance || [])
        .filter((item) => {
          const date = new Date(item.date);
          return date.getMonth() + 1 === month && date.getFullYear() === year;
        })
        .map((item) => [new Date(item.date).getDate(), item.status]),
    );

    const firstDay = new Date(year, month - 1, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // monday-first
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      if (index < startOffset) {
        return {
          key: `prev-${index}`,
          day: prevMonthDays - startOffset + index + 1,
          type: "prev",
        };
      }

      const currentDay = index - startOffset + 1;
      if (currentDay <= daysInMonth) {
        return {
          key: `cur-${currentDay}`,
          day: currentDay,
          type: "current",
          status: statusByDay.get(currentDay) || "None",
          isToday: isCurrentMonth && currentDay === today,
        };
      }

      return {
        key: `next-${index}`,
        day: currentDay - daysInMonth,
        type: "next",
      };
    });
  }, [attendanceState.data?.attendance, isCurrentMonth, month, today, year]);

  if (dashboardState.loading) return <Loader text="Loading student dashboard..." />;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-[#050a7a] px-6 py-7 text-white shadow-xl md:px-8">
        <div className="absolute -right-8 -top-8 h-52 w-52 rounded-full bg-white/10 blur-sm" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile.userId?.photo ? (
                <img
                  src={profile.userId.photo}
                  alt={profile.userId?.name || "Student"}
                  className="h-32 w-32 rounded-2xl border-4 border-accent object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-accent bg-white/20 text-5xl font-bold">
                  {profile.userId?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
              <span className="absolute -bottom-3 right-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                Active
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Welcome Back, Scholar</p>
              <h1 className="mt-2 font-heading text-4xl">{profile.userId?.name || "Student"}</h1>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-indigo-100">
                <span>Roll No: {profile.rollNo || "-"}</span>
                <span>
                  Class: {profile.class || "-"}-{profile.section || "-"}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden text-right lg:block">
            <p className="font-heading text-3xl text-white/15">{year}</p>
            <p className="mt-2 text-xl italic text-amber-300">"Excellence is not an act, but a habit."</p>
            <p className="text-sm text-indigo-200">— Aristotle</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <UpcomingLectureCard lecture={nextLecture} title="Next Lecture" />
        <div className="rounded-2xl bg-white p-5 shadow-card lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Today's Schedule</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{todayLectures.length} lectures</span>
          </div>
          <div className="space-y-3">
            {todayLectures.map((lecture) => {
              const status = getLectureStatus(lecture);
              return (
                <div key={lecture._id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">{lecture.subject}</p>
                      <p className="text-xs text-slate-500">{lecture.teacherName}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>
                      {status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {formatTimeLabel(lecture.startTime)} - {formatTimeLabel(lecture.endTime)}
                  </p>
                </div>
              );
            })}
            {!todayLectures.length && <p className="text-sm text-slate-500">No lectures scheduled for today.</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">

        <div className="rounded-2xl bg-white p-5 shadow-card sm:p-6 lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-3xl text-primary">Attendance Tracker</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" /> Late
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-600" /> Absent
              </span>
            </div>
          </div>

          {isLargeScreen ? (
            <>
              <div className="mb-2 grid grid-cols-7 gap-3 text-center text-xs font-bold tracking-[0.2em] text-slate-400">
                {weekLabels.map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              {attendanceState.loading ? (
                <Loader text="Loading attendance..." />
              ) : (
                <div className="grid grid-cols-7 gap-3">
                  {calendarCells.map((cell) => {
                    if (cell.type !== "current") {
                      return (
                        <div
                          key={cell.key}
                          className="flex aspect-square items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-300"
                        >
                          {cell.day}
                        </div>
                      );
                    }

                    const baseClass = "flex aspect-square items-center justify-center rounded-xl border text-3xl font-semibold";
                    const toneClass = cell.isToday
                      ? "border-primary bg-primary text-white ring-4 ring-primary/20"
                      : cell.status === "Present"
                        ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                        : cell.status === "Leave"
                          ? "border-amber-400 bg-amber-100 text-amber-900"
                          : cell.status === "Absent"
                            ? "border-rose-300 bg-rose-100 text-rose-700"
                            : "border-slate-200 bg-slate-100 text-slate-400";

                    return (
                      <div key={cell.key} className={`${baseClass} ${toneClass}`}>
                        {cell.day}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3" aria-label="Attendance summary">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Present</p>
                <p className="mt-2 text-3xl font-heading text-emerald-900">{attendanceSummary.present || 0}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">Absent</p>
                <p className="mt-2 text-3xl font-heading text-rose-800">{attendanceSummary.absent || 0}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Leave</p>
                <p className="mt-2 text-3xl font-heading text-amber-900">{attendanceSummary.leave || 0}</p>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-heading text-primary">{attendanceSummary.percentage || 0}%</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Monthly Average</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-3xl font-heading text-emerald-900 sm:text-4xl">
                  {attendanceSummary.absent || 0} Days Absent
                </p>
                <p className="text-sm text-slate-500">
                  Remaining allowed leaves: {Math.max(0, 7 - Number(attendanceSummary.leave || 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl bg-accent p-6 shadow-lg">
            <div className="mb-3 flex items-start justify-between">
              <span className="text-3xl">💳</span>
              <span className="rounded-full bg-white/40 px-3 py-1 text-xs font-bold uppercase">
                {feeData.status || "Pending"}
              </span>
            </div>
            <p className="text-5xl font-heading text-[#5a3a00]">₹{pendingFee}</p>
            <p className="mt-1 text-xl text-[#5a3a00]/90">Tuition & Lab Fees (Q3)</p>
            <div className="mt-6 flex items-end justify-between border-t border-black/10 pt-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#5a3a00]/70">Due Date</p>
                <p className="text-4xl font-heading text-[#5a3a00]">{dueDate}</p>
              </div>
              <Link
                to="/student/fees"
                className="rounded-lg bg-primary px-5 py-2 text-xl font-bold text-white hover:brightness-95"
              >
                Pay Now
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="font-heading text-4xl text-primary">Latest Assessment</h3>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Class Rank</p>
                <p className="font-heading text-5xl text-primary">
                  --
                  <span className="text-3xl text-slate-400">/--</span>
                </p>
              </div>
              <div className="h-14 w-px bg-slate-200" />
              <div className="text-right">
                <p className="text-sm text-slate-400">Grade</p>
                <p className="font-heading text-5xl text-emerald-900">{topResult?.grade || "--"}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xl">
                <p className="text-slate-600">
                  {topResult ? `${topResult.subject} (${String(topResult.examType || "").toLowerCase()})` : "No result yet"}
                </p>
                <p className="font-bold text-primary">
                  {topResult ? `${topResult.marksObtained}/${topResult.maxMarks}` : "--/--"}
                </p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${topResultPercent}%` }} />
              </div>
              <p className="mt-2 text-sm italic text-indigo-500">
                {topResultPercent >= 90 ? "Top performance in latest evaluation" : "Keep improving steadily"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden rounded-2xl bg-white p-6 shadow-card lg:block">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Weekly Schedule</p>
            <h2 className="mt-1 font-heading text-3xl text-primary">Class Timetable</h2>
          </div>
          {timetableState.loading ? <span className="text-sm text-slate-500">Loading...</span> : null}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Day</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Teacher</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {timetableEntries.map((lecture) => {
                const status = getLectureStatus(lecture);
                return (
                  <tr key={lecture._id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-700">{lecture.day}</td>
                    <td className="px-4 py-3 text-primary">{lecture.subject}</td>
                    <td className="px-4 py-3 text-slate-600">{lecture.teacherName}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatTimeLabel(lecture.startTime)} - {formatTimeLabel(lecture.endTime)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
              {!timetableEntries.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No timetable entries found for your class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Link
          to="/student/materials"
          className="group flex items-center justify-between rounded-2xl bg-white p-6 shadow-card transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-primary">📖</div>
            <div>
              <p className="font-heading text-4xl text-primary">Study Materials</p>
              <p className="text-xl text-slate-600">Access video lectures & PDF notes for XII Science</p>
            </div>
          </div>
          <span className="text-3xl text-slate-400 group-hover:text-primary">›</span>
        </Link>

        <Link
          to="/student/exams"
          className="group flex items-center justify-between rounded-2xl bg-indigo-50 p-6 shadow-card transition-colors hover:bg-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-white">🗓️</div>
            <div>
              <p className="font-heading text-4xl text-primary">Upcoming Exams</p>
              <p className="text-xl text-slate-600">
                {upcomingExam
                  ? `${upcomingExam.subject}: ${new Date(upcomingExam.date).toLocaleDateString()}`
                  : `${stats.upcomingExams || 0} exams scheduled`}
              </p>
            </div>
          </div>
          <span className="text-3xl text-slate-400 group-hover:text-primary">›</span>
        </Link>
      </section>
    </div>
  );
};

export default StudentDashboard;
