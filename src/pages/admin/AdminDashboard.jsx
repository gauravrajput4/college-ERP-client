import useFetch from "../../hooks/useFetch";
import { getDashboard } from "../../api/admin.api";
import Loader from "../../components/Loader";

const formatCompactCurrency = (value) => {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NA";

const getRelativeLabel = (dateValue) => {
  if (!dateValue) return "Just now";
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const hours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days <= 1 ? "Yesterday" : `${days} days ago`;
};

const statusTone = {
  Present: "text-emerald-700",
  Leave: "text-amber-700",
  Absent: "text-rose-700",
};

const AdminDashboard = () => {
  const dashboardState = useFetch(getDashboard, []);

  if (dashboardState.loading) return <Loader text="Loading command center..." />;

  const data = dashboardState.data || {};
  const stats = data.stats || {};
  const enquiries = data.recentEnquiries || [];
  const attendance = data.attendanceToday || [];

  const attendanceMap = attendance.reduce((acc, item) => {
    acc[item._id] = Number(item.count || 0);
    return acc;
  }, {});

  const presentCount = attendanceMap.Present || 0;
  const leaveCount = attendanceMap.Leave || 0;
  const absentCount = attendanceMap.Absent || 0;
  const attendanceTotal = presentCount + leaveCount + absentCount;
  const attendancePercent = attendanceTotal ? Math.round((presentCount / attendanceTotal) * 100) : 0;
  const circleDash = `${attendancePercent}, 100`;

  const revenueCards = [
    { label: "Tuition Fees", value: stats.feeCollected || 0, accent: "bg-amber-400" },
    { label: "Transport", value: Math.round((stats.feeCollected || 0) * 0.16), accent: "bg-slate-300" },
    { label: "Examination", value: Math.round((stats.feeCollected || 0) * 0.11), accent: "bg-slate-300" },
    { label: "Misc.", value: Math.round((stats.feeCollected || 0) * 0.18), accent: "bg-slate-300" },
  ];

  const bulletins = [
    {
      title: "Annual Sports Day Schedule Finalization",
      tag: "General Priority",
      date: "Published 20 Oct",
    },
    {
      title: "Quarterly Faculty Assessment Review",
      tag: "Academic",
      date: "Published 18 Oct",
    },
  ];

  return (
    <div className="space-y-6 bg-[#f6f7fc]">
      <section className="rounded-[28px] bg-gradient-to-br from-white via-[#fbfbff] to-[#f3f4fb] p-6 shadow-[0_24px_70px_rgba(41,52,149,0.08)] sm:p-7">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-600">
            Institutional Health Dashboard
          </p>
          <h1 className="mt-2 font-heading text-3xl text-primary sm:text-4xl">Command Center</h1>
        </div>

        <div className="mt-7 grid gap-5 xl:grid-cols-12">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] xl:col-span-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Total Enrollment</p>
                <div className="mt-5 flex items-end gap-6">
                  <div>
                    <p className="text-4xl font-black text-primary sm:text-5xl">{stats.totalStudents || 0}</p>
                    <p className="mt-1 text-sm text-slate-500">Students Registered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#7c8cff] sm:text-3xl">{stats.totalTeachers || 0}</p>
                    <p className="mt-1 text-sm text-slate-500">Faculty/Staff</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-amber-400" style={{ width: "92%" }} />
            </div>
            <p className="mt-3 text-xs font-medium italic text-slate-500">
              92% capacity utilized for Academic Session 2024-25
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Revenue Lifecycle</p>
                <p className="mt-3 text-3xl font-black text-primary sm:text-4xl">
                  {formatCompactCurrency(stats.feeCollected || 0)} Collected
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-500">Critical Action</p>
                <p className="mt-1 text-xl font-black text-rose-600 sm:text-2xl">
                  {formatCompactCurrency(stats.pendingFees || 0)} Pending
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {revenueCards.map((card) => (
                <div key={card.label} className="relative overflow-hidden rounded-[18px] bg-[#f5f6fb] p-4">
                  <span className={`absolute inset-y-0 left-0 w-1.5 rounded-r-full ${card.accent}`} />
                  <p className="pl-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
                  <p className="pl-3 pt-2 text-2xl font-black text-primary">{formatCompactCurrency(card.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-12">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] xl:col-span-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">New Enquiries</h2>
              <button className="text-xs font-black uppercase tracking-[0.14em] text-amber-600">View Pipeline</button>
            </div>

            <div className="space-y-4">
              {enquiries.slice(0, 3).map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-sm font-black text-primary">
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        Class {item.classApplying || "-"} • {getRelativeLabel(item.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl text-slate-300">›</span>
                </div>
              ))}

              {!enquiries.length && <p className="text-sm text-slate-500">No new enquiries available.</p>}
            </div>
          </div>

          <div className="rounded-[24px] bg-[#f1f2f7] p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] xl:col-span-3">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Daily Attendance</h2>

            <div className="mt-6 flex justify-center">
              <div className="relative h-44 w-44">
                <svg viewBox="0 0 42 42" className="h-44 w-44 -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#d9dbe8" strokeWidth="3.5" />
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="none"
                    stroke="#0b5b1d"
                    strokeWidth="3.5"
                    strokeDasharray={circleDash}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-black text-primary">{attendancePercent}%</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Present Rate
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              {presentCount}/{attendanceTotal || presentCount} staff present
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-3 text-center">
                <p className="text-2xl font-black text-slate-900">{leaveCount}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Leave</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center">
                <p className="text-2xl font-black text-rose-600">{absentCount}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Absent</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] bg-[#322d91] p-5 text-white shadow-[0_18px_44px_rgba(50,45,145,0.28)] xl:col-span-4">
            <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-white/5 blur-md" />
            <div className="absolute bottom-0 right-10 text-[160px] font-black leading-none text-white/5">★</div>

            <div className="relative">
              <h2 className="text-sm font-black uppercase tracking-[0.24em] text-amber-300">
                Institutional Bulletins
              </h2>

              <div className="mt-6 space-y-6">
                {bulletins.map((item, index) => (
                  <div key={item.title} className={`border-l-2 pl-4 ${index === 0 ? "border-amber-300" : "border-sky-300/60"}`}>
                    <p className="text-xs italic text-white/70">{item.date}</p>
                    <p className="mt-2 text-lg font-bold leading-snug">{item.title}</p>
                    <span className="mt-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">
                Post New Notice
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 rounded-[24px] bg-[#302b8e] px-6 py-5 text-white shadow-[0_18px_44px_rgba(50,45,145,0.2)] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <h3 className="font-heading text-3xl text-amber-300">BJP Memorial Inter College</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/65">
              © 2024 BJP Memorial Inter College. Established 1988.
            </p>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Mandatory Disclosure</div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Alumni Network</div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Career</div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Contact</div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
