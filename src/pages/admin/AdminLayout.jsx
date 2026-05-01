import DashboardLayout from "../../components/DashboardLayout";

const links = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Students", to: "/admin/students" },
  { label: "Teachers", to: "/admin/teachers" },
  { label: "Subjects", to: "/admin/subjects" },
  { label: "Timetable", to: "/admin/timetable" },
  { label: "Exam Schedule", to: "/admin/exams/create" },
  { label: "Attendance", to: "/admin/results?tab=attendance" },
  { label: "Results", to: "/admin/results" },
  { label: "Fees", to: "/admin/fees" },
  { label: "Notice Board", to: "/admin/notices" },
  { label: "Gallery", to: "/admin/gallery" },
  { label: "Enquiries", to: "/admin/enquiries" },
  { label: "Profile", to: "/admin/profile" },
];

const AdminLayout = () => {
  return <DashboardLayout roleLabel="Administrator" sidebarTitle="Admin Panel" links={links} />;
};

export default AdminLayout;
