import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useFetch from "../../hooks/useFetch";
import { getDashboard } from "../../api/admin.api";
import Loader from "../../components/Loader";
import { getStudents } from "../../api/students";
import { Users, GraduationCap, Wallet, ClipboardCheck, Calendar as CalendarIcon, Megaphone, UserPlus, FileSpreadsheet, PlusCircle, CheckSquare, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const formatCompactCurrency = (value) => {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
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

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const dashboardState = useFetch(getDashboard, []);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["students", { page: 1, limit: 10, search: "", className: "", section: "", department: "" }],
      queryFn: () =>
        getStudents({ page: 1, limit: 10, search: "", className: "", section: "", department: "" }),
    });
  }, [queryClient]);

  if (dashboardState.loading) return <Loader text="Loading dashboard..." />;

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
  
  // Circumference of SVG circle is ~100
  const circleDash = `${attendancePercent}, 100`;

  // Hardcoded data for sections that aren't dynamic in API
  const feeChartData = [
    { label: "1 May", height: "40%" },
    { label: "6 May", height: "40%" },
    { label: "11 May", height: "55%" },
    { label: "16 May", height: "65%" },
    { label: "21 May", height: "72%" },
    { label: "26 May", height: "85%" },
    { label: "31 May", height: "75%", color: "bg-accent" }, // Current bar
  ];

  const announcements = [
    { title: "Annual Sports Day Schedule Finalization", date: "22 May 2024" },
    { title: "Quarterly Faculty Assessment Review", date: "20 May 2024" },
    { title: "Examination Form Submission Deadline Extended", date: "18 May 2024" },
  ];

  const upcomingEvents = [
    { title: "Parent-Teacher Meeting", time: "10:00 AM - 12:00 PM", day: "25", month: "MAY" },
    { title: "Monthly Staff Meeting", time: "02:00 PM - 03:30 PM", day: "30", month: "MAY" },
    { title: "Environment Awareness Program", time: "11:00 AM - 01:00 PM", day: "05", month: "JUN" },
  ];

  const currentDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="space-y-6 bg-page pb-8 text-slate-800 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Welcome back, Admin! 👋</h1>
          <p className="text-slate-600 mt-1">Here's what's happening in your institution today.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0 text-slate-600 font-medium">
          <CalendarIcon size={18} className="text-primary" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-50/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider mb-0.5">Total Students</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-slate-800 leading-none">{stats.totalStudents?.toLocaleString() || "0"}</h2>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 5.2% <span className="text-slate-400 font-normal">this month</span></p>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-50/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <GraduationCap className="text-accent" size={28} />
          </div>
          <div>
            <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider mb-0.5">Total Teachers</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-slate-800 leading-none">{stats.totalTeachers?.toLocaleString() || "0"}</h2>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 3.1% <span className="text-slate-400 font-normal">this month</span></p>
          </div>
        </div>

        {/* Total Fees */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-50/50 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Wallet className="text-white" size={24} />
          </div>
          <div>
            <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider mb-0.5">Total Fees Collected</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-slate-800 leading-none">{formatCompactCurrency(stats.feeCollected)}</h2>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 8.7% <span className="text-slate-400 font-normal">this month</span></p>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-50/50 flex items-center gap-4 hover:shadow-md transition-shadow justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <ClipboardCheck className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider mb-0.5">Attendance Today</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-slate-800 leading-none">{attendancePercent}%</h2>
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 2.4% <span className="text-slate-400 font-normal">this month</span></p>
            </div>
          </div>
          <div className="text-slate-300">›</div>
        </div>

      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fee Collection Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50 lg:col-span-1 xl:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-primary text-lg">Fee Collection Overview</h3>
            <select className="text-xs border-slate-200 rounded-md text-slate-600 py-1 pl-2 pr-6">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          
          {/* Simple CSS Bar Chart */}
          <div className="h-48 flex items-end justify-between relative mt-8 pb-6 border-b border-slate-100">
            {/* Y-axis markers */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6 text-[10px] text-slate-400 font-medium">
              <span>2L</span>
              <span>1.5L</span>
              <span>1L</span>
              <span>50K</span>
              <span>0</span>
            </div>
            
            {/* Bars */}
            <div className="w-full flex justify-between items-end h-full pl-8 z-10 gap-2 px-2">
              {feeChartData.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div 
                    className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 group-hover:opacity-80 ${bar.color || 'bg-primary'}`}
                    style={{ height: bar.height }}
                  ></div>
                  <span className="text-[10px] text-slate-500 mt-2 absolute -bottom-5 whitespace-nowrap">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Attendance Donut */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50 flex flex-col items-center justify-center">
          <h3 className="font-heading font-bold text-primary text-lg self-start w-full mb-6">Student Attendance</h3>
          
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
              <path
                className="text-accent"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary"
                strokeWidth="4"
                strokeDasharray={`${attendancePercent}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary">{attendancePercent}%</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Present</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 w-full px-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-3 h-3 rounded-full bg-primary shrink-0"></span>
              <span className="text-slate-700 font-medium">Present ({presentCount || "1,148"})</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-3 h-3 rounded-full bg-accent shrink-0"></span>
              <span className="text-slate-700 font-medium">Absent ({absentCount || "100"})</span>
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-primary text-lg">Recent Announcements</h3>
            <Link to="/admin/notices" className="text-xs text-accent font-bold">View All</Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {announcements.map((ann, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 mt-1">
                  <Megaphone size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 leading-snug">{ann.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{ann.date}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/admin/notices" className="mt-6 w-full py-2.5 bg-accent hover:bg-accent-light text-white rounded-lg font-bold text-sm text-center transition-colors flex items-center justify-center gap-2">
            <PlusCircle size={16} /> Post New Announcement
          </Link>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-primary text-lg">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="text-xs text-accent font-bold">View All</Link>
          </div>
          <div className="space-y-5">
            {enquiries.length > 0 ? enquiries.slice(0, 3).map((enq, idx) => (
              <div key={idx} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-[#FFF7ED] text-primary font-bold flex items-center justify-center shrink-0">
                  {getInitials(enq.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800">{enq.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">{enq.query || "Query text not available in snippet."}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{getRelativeLabel(enq.submittedAt)}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No recent enquiries.</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50">
          <h3 className="font-heading font-bold text-primary text-lg mb-6">Quick Links</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Add Student", icon: UserPlus, to: "/admin/students" },
              { label: "Add Teacher", icon: UserPlus, to: "/admin/teachers" },
              { label: "Create Timetable", icon: CalendarIcon, to: "/admin/timetable" },
              { label: "Mark Attendance", icon: CheckSquare, to: "/admin/results?tab=attendance" },
              { label: "Manage Fees", icon: Wallet, to: "/admin/fees" },
              { label: "Generate Report", icon: FileSpreadsheet, to: "/admin/results" },
            ].map((link, idx) => (
              <Link key={idx} to={link.to} className="border border-slate-100 hover:border-accent hover:shadow-sm transition-all rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 group">
                <link.icon size={20} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-semibold text-slate-600">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-primary text-lg">Upcoming Events</h3>
            <Link to="/admin/notices" className="text-xs text-accent font-bold">View Calendar</Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((evt, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex flex-col items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                  <span className="text-lg font-bold leading-none">{evt.day}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wide mt-0.5">{evt.month}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{evt.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{evt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-500 gap-4">
        <p>© 2024 BJP Memorial Inter College. All rights reserved.</p>
        <div className="flex gap-4 sm:gap-6 text-primary">
          <Link to="#" className="hover:underline">Privacy Policy</Link>
          <span className="text-slate-300">|</span>
          <Link to="#" className="hover:underline">Terms of Service</Link>
          <span className="text-slate-300">|</span>
          <Link to="#" className="hover:underline">Help Center</Link>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
