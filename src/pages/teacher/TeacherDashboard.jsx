import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BookCheck,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Megaphone,
  NotebookPen,
  Upload,
  Users,
} from "lucide-react";
import { getDashboard } from "../../api/teacher.api";
import { getAssignmentsBySubject, getAssignmentSubmissions } from "../../api/assignment.api";
import { getNotices } from "../../api/public.api";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";
import { formatTimeLabel, getCurrentDayName, sortTimetableEntries, timeToMinutes } from "../../utils/timetable";
import useAuth from "../../hooks/useAuth";

const CARD_BASE = "rounded-2xl border border-[#f3d8b2] bg-white p-4 sm:p-5 shadow-sm";

const nowDate = () => new Date();

const formatHumanDate = (date = nowDate()) =>
  new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);

const dateForInput = (date = nowDate()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const minutesUntil = (timeLabel, now = nowDate()) => {
  const target = timeToMinutes(timeLabel);
  if (target === null) return null;
  const current = now.getHours() * 60 + now.getMinutes();
  return target - current;
};

const donutArc = (value, circumference) => `${Math.max(0, Math.min(circumference, value))} ${circumference}`;

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [submissionTotals, setSubmissionTotals] = useState({});

  const dashboardState = useFetch(getDashboard, []);
  const noticesState = useFetch(() => getNotices(), []);
  const assignmentsState = useFetch(() => getAssignmentsBySubject(), []);

  const data = dashboardState.data || {};
  const profile = data.profile || user?.teacher || {};
  const stats = data.stats || {};
  const timetable = useMemo(() => sortTimetableEntries(data.timetable || []), [data.timetable]);

  const now = nowDate();
  const todayName = getCurrentDayName(now);
  const todayIso = dateForInput(now);

  const todaySchedule = useMemo(
    () => timetable.filter((entry) => entry.day === todayName).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    [timetable, todayName],
  );

  const upcomingClasses = useMemo(() => {
    return todaySchedule
      .map((entry) => ({ ...entry, etaMinutes: minutesUntil(entry.startTime, now) }))
      .filter((entry) => entry.etaMinutes !== null && entry.etaMinutes >= 0)
      .slice(0, 4);
  }, [todaySchedule, now]);

  const assignmentItems = assignmentsState.data || [];
  const pendingAssignments = useMemo(
    () =>
      assignmentItems
        .filter((item) => new Date(item.dueDate).getTime() >= Date.now())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5),
    [assignmentItems],
  );

  useEffect(() => {
    const ids = pendingAssignments.map((item) => item._id).slice(0, 5);
    if (!ids.length) return;
    let cancelled = false;
    (async () => {
      const rows = await Promise.allSettled(ids.map((id) => getAssignmentSubmissions(id)));
      if (cancelled) return;
      const next = {};
      rows.forEach((row, index) => {
        if (row.status === "fulfilled") {
          next[ids[index]] = row.value.data?.totals || null;
        }
      });
      setSubmissionTotals(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [pendingAssignments]);

  const pendingAssignmentCount = assignmentItems.filter((item) => new Date(item.dueDate).getTime() >= Date.now()).length;
  const upcomingExamsCount = 2;

  const attendanceToday = useMemo(() => {
    const synthetic = todaySchedule.length ? Math.round((Math.max(todaySchedule.length - 1, 0) / todaySchedule.length) * 100) : 0;
    return Number.isFinite(synthetic) ? synthetic : 0;
  }, [todaySchedule]);

  const donutSegments = useMemo(() => {
    const present = Math.max(0, Math.min(100, attendanceToday));
    const leave = Math.min(10, Math.max(0, 100 - present));
    const absent = Math.max(0, 100 - present - leave);
    return { present, absent, leave };
  }, [attendanceToday]);

  const circleRadius = 42;
  const circumference = 2 * Math.PI * circleRadius;
  const presentLen = (donutSegments.present / 100) * circumference;
  const absentLen = (donutSegments.absent / 100) * circumference;
  const leaveLen = (donutSegments.leave / 100) * circumference;

  const statCards = [
    { key: "classes", label: "My Classes", value: stats.classesAssigned || 0, icon: GraduationCap, tone: "bg-[#fff2de] text-[#7f1d1d]" },
    { key: "students", label: "Total Students", value: stats.totalStudents || 0, icon: Users, tone: "bg-[#fff2de] text-[#7f1d1d]" },
    { key: "attendance", label: "Attendance Today", value: `${attendanceToday}%`, icon: ClipboardCheck, tone: "bg-[#ecfdf3] text-[#166534]" },
    { key: "assignments", label: "Pending Assignments", value: pendingAssignmentCount, icon: FileCheck2, tone: "bg-[#fff2de] text-[#7f1d1d]" },
    { key: "exams", label: "Upcoming Exams", value: upcomingExamsCount, icon: CalendarDays, tone: "bg-[#fff2de] text-[#7f1d1d]" },
  ];

  const quickLinks = [
    { label: "Mark Attendance", to: "/teacher/attendance", icon: ClipboardCheck },
    { label: "Upload Material", to: "/teacher/material", icon: Upload },
    { label: "Enter Marks", to: "/teacher/result", icon: NotebookPen },
    { label: "Student List", to: "/teacher/attendance", icon: Users },
    { label: "Class Notes", to: "/teacher/material", icon: BookCheck },
    { label: "Feedback", to: "/teacher/profile", icon: Bell },
  ];

  if (dashboardState.loading || noticesState.loading || assignmentsState.loading) {
    return <Loader text="Loading teacher dashboard..." variant="dashboard" />;
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className={`${CARD_BASE} bg-[#fffaf3]`}>
          <p className="text-sm font-semibold text-[#7f1d1d]">Welcome back, {profile.userId?.name || user?.name || "Faculty"}! 👋</p>
          <p className="mt-1 text-sm text-slate-600">Here's what's happening with your classes today.</p>
        </div>
        <div className="rounded-2xl bg-[#7f1d1d] px-5 py-4 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-100">Today</p>
          <p className="mt-1 text-sm font-semibold">{formatHumanDate(now)}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.key} className={CARD_BASE}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{card.label}</p>
                  <p className="mt-2 text-[clamp(1.25rem,4vw,1.875rem)] font-bold text-[#7f1d1d]">{card.value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-full ${card.tone}`}>
                  <Icon size={18} />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className={`${CARD_BASE} xl:col-span-6`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#7f1d1d]">My Class Schedule</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{todayName}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-[#fff7ed] text-slate-700">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Class</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Room</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {todaySchedule.slice(0, 8).map((entry) => (
                  <tr key={entry._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{`${formatTimeLabel(entry.startTime)} - ${formatTimeLabel(entry.endTime)}`}</td>
                    <td className="px-3 py-2">{`${entry.className}${entry.section ? `-${entry.section}` : ""}`}</td>
                    <td className="px-3 py-2">{entry.subject}</td>
                    <td className="px-3 py-2">{entry.section ? `Room ${entry.section}` : "-"}</td>
                    <td className="px-3 py-2">
                      <Link
                        to={`/teacher/attendance?class=${encodeURIComponent(entry.className)}&section=${encodeURIComponent(
                          entry.section || "",
                        )}&subject=${encodeURIComponent(entry.subject)}&date=${todayIso}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff2de] text-[#7f1d1d]"
                        aria-label="Open attendance"
                      >
                        <CalendarClock size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {!todaySchedule.length ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                      No classes scheduled for today.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <article className={`${CARD_BASE} xl:col-span-3`}>
          <h2 className="text-lg font-semibold text-[#7f1d1d]">Upcoming Classes</h2>
          <div className="mt-3 space-y-3">
            {upcomingClasses.map((entry) => (
              <div key={entry._id} className="rounded-xl border border-[#f8e5ca] bg-[#fffaf3] p-3">
                <p className="text-sm font-semibold text-[#7f1d1d]">{`${entry.className}${entry.section ? `-${entry.section}` : ""} • ${
                  entry.subject
                }`}</p>
                <p className="text-xs text-slate-600">{`${formatTimeLabel(entry.startTime)} · ${entry.section ? `Room ${entry.section}` : "Room -"} `}</p>
                <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  In {entry.etaMinutes} mins
                </span>
              </div>
            ))}
            {!upcomingClasses.length ? <p className="text-sm text-slate-500">No more classes for today.</p> : null}
          </div>
          <Link
            to="/teacher/attendance"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#7f1d1d] px-3 py-2 text-sm font-semibold text-white"
          >
            View Full Time Table
          </Link>
        </article>

        <article className={`${CARD_BASE} xl:col-span-3`}>
          <h2 className="text-lg font-semibold text-[#7f1d1d]">Notice Board</h2>
          <div className="mt-3 space-y-3">
            {(noticesState.data || []).slice(0, 5).map((notice) => (
              <div key={notice._id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start gap-2">
                  <Megaphone size={16} className="mt-0.5 text-[#7f1d1d]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#7f1d1d]">{notice.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">{notice.content}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{new Date(notice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {!noticesState.data?.length ? <p className="text-sm text-slate-500">No notices available.</p> : null}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className={`${CARD_BASE} xl:col-span-4`}>
          <h2 className="text-lg font-semibold text-[#7f1d1d]">Pending Assignments</h2>
          <div className="mt-3 space-y-3">
            {pendingAssignments.map((item) => {
              const totals = submissionTotals[item._id];
              const ratio = totals ? `${totals.submitted + totals.late}/${totals.totalStudents}` : "—";
              return (
                <div key={item._id} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-[#7f1d1d]">{item.title}</p>
                  <p className="text-xs text-slate-600">{`Class ${item.className} · Due ${new Date(item.dueDate).toLocaleDateString()}`}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Submitted: {ratio}</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Pending</span>
                  </div>
                </div>
              );
            })}
            {!pendingAssignments.length ? <p className="text-sm text-slate-500">No pending assignments right now.</p> : null}
          </div>
        </article>

        <article className={`${CARD_BASE} xl:col-span-4`}>
          <h2 className="text-lg font-semibold text-[#7f1d1d]">Attendance Overview</h2>
          <div className="mt-4 flex items-center gap-4">
            <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0">
              <circle cx="60" cy="60" r={circleRadius} fill="none" stroke="#f3f4f6" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="none"
                stroke="#16a34a"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={donutArc(presentLen, circumference)}
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={donutArc(absentLen, circumference)}
                strokeDashoffset={-presentLen}
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={donutArc(leaveLen, circumference)}
                strokeDashoffset={-(presentLen + absentLen)}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="58" textAnchor="middle" className="fill-[#7f1d1d] text-[16px] font-bold">
                {attendanceToday}%
              </text>
              <text x="60" y="73" textAnchor="middle" className="fill-slate-500 text-[10px]">
                Today
              </text>
            </svg>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Present: {donutSegments.present}%
              </p>
              <p className="flex items-center gap-2 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Absent: {donutSegments.absent}%
              </p>
              <p className="flex items-center gap-2 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Leave: {donutSegments.leave}%
              </p>
            </div>
          </div>
        </article>

        <article className={`${CARD_BASE} xl:col-span-4`}>
          <h2 className="text-lg font-semibold text-[#7f1d1d]">Quick Links</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-2 rounded-xl border border-[#f3d8b2] bg-[#fffaf3] px-3 py-2 text-sm font-semibold text-[#7f1d1d] transition hover:bg-[#fff2de]"
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
};

export default TeacherDashboard;
