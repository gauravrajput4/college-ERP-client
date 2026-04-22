import { getDashboard, getTimetable } from "../../api/teacher.api";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import UpcomingLectureCard from "../../components/UpcomingLectureCard";
import useFetch from "../../hooks/useFetch";
import {
  formatTimeLabel,
  getLectureStatus,
  getNextLecture,
  getStatusClasses,
  getTodayLectures,
  sortTimetableEntries,
} from "../../utils/timetable";

const TeacherDashboard = () => {
  const dashboardState = useFetch(getDashboard, []);
  const timetableState = useFetch(() => getTimetable(), []);

  if (dashboardState.loading) return <Loader />;

  const data = dashboardState.data || {};
  const timetableEntries = sortTimetableEntries(timetableState.data || data.timetable || []);
  const nextLecture = getNextLecture(timetableEntries);
  const todayLectures = getTodayLectures(timetableEntries);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-white p-6 shadow-card">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-amber-600">Institutional Dashboard</span>
          <h1 className="mt-1 font-heading text-3xl text-primary">
            Welcome, {data.profile?.userId?.name || "Teacher"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Employee ID: {data.profile?.employeeId || "-"} · {data.profile?.designation || "Faculty Member"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/teacher/attendance" className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-slate-900">
            Mark Attendance
          </Link>
          <Link to="/teacher/result" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            Upload Marks
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Classes Assigned</p>
          <p className="mt-2 text-3xl font-bold text-primary">{data.stats?.classesAssigned || 0}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total Students</p>
          <p className="mt-2 text-3xl font-bold text-primary">{data.stats?.totalStudents || 0}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Materials Uploaded</p>
          <p className="mt-2 text-3xl font-bold text-primary">{data.stats?.materialsUploaded || 0}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-slate-500">Results Uploaded</p>
          <p className="mt-2 text-3xl font-bold text-primary">{data.stats?.resultsUploaded || 0}</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <UpcomingLectureCard lecture={nextLecture} title="Next Teaching Slot" />

        <div className="rounded-2xl bg-white p-5 shadow-card lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Today's Schedule</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{todayLectures.length} sessions</span>
          </div>
          <div className="space-y-3">
            {todayLectures.map((lecture) => {
              const status = getLectureStatus(lecture);
              return (
                <div key={lecture._id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">{lecture.subject}</p>
                      <p className="text-xs text-slate-500">{lecture.className}</p>
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
            {!todayLectures.length && <p className="text-sm text-slate-500">No sessions scheduled today.</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Assigned Classes</h2>
            <span className="text-xs uppercase tracking-widest text-slate-500">Current Session</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(data.subjectAssignments || []).map((subj, idx) => (
              <div
                key={`${subj.subject}-${idx}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-primary hover:text-white"
              >
                <p className="text-xs uppercase tracking-wider text-amber-600">{`Class ${subj.class}-${subj.section}`}</p>
                <h3 className="mt-1 text-lg font-bold">{subj.subject}</h3>
                <p className="mt-2 text-xs opacity-80">{subj.remarks || "Class assigned for this session"}</p>
              </div>
            ))}
            {!data.subjectAssignments?.length && (
              <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">No class assignments found.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card">
          <h2 className="text-xl font-semibold text-primary">Today's Focus</h2>
          <div className="mt-4 space-y-3">
            {(data.subjectAssignments || []).slice(0, 3).map((subj, idx) => (
              <div key={`${subj.subject}-${idx}`} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-800">{subj.subject}</p>
                <p className="text-xs text-slate-500">
                  Class {subj.class} · Section {subj.section}
                </p>
              </div>
            ))}
            {!data.subjectAssignments?.length && <p className="text-sm text-slate-500">No sessions planned today.</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">Recently Uploaded Materials</h2>
          <Link to="/teacher/material" className="text-sm font-bold text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {(data.recentMaterials || []).map((mat) => (
            <div key={mat._id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-primary">{mat.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {mat.subject} · Class {mat.class}
              </p>
              <p className="mt-2 text-xs text-slate-400">{new Date(mat.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {!data.recentMaterials?.length && <p className="text-sm text-slate-500">No materials uploaded yet.</p>}
        </div>
      </section>

      <section className="hidden rounded-xl bg-white p-5 shadow-card lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">Weekly Timetable</h2>
          {timetableState.loading ? <span className="text-sm text-slate-500">Loading...</span> : null}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Day</th>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {timetableEntries.map((lecture) => {
                const status = getLectureStatus(lecture);
                return (
                  <tr key={lecture._id} className="border-t">
                    <td className="px-4 py-3">{lecture.day}</td>
                    <td className="px-4 py-3">{lecture.className}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{lecture.subject}</td>
                    <td className="px-4 py-3">
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
                    No timetable entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
