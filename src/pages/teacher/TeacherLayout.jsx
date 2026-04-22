import DashboardLayout from "../../components/DashboardLayout";

const links = [
  { label: "Dashboard", to: "/teacher/dashboard" },
  { label: "Mark Attendance", to: "/teacher/attendance" },
  { label: "Upload Material", to: "/teacher/material" },
  { label: "Upload Result", to: "/teacher/result" },
  { label: "Profile", to: "/teacher/profile" },
];

const TeacherLayout = () => {
  return <DashboardLayout roleLabel="Teacher" sidebarTitle="Teacher Panel" links={links} />;
};

export default TeacherLayout;
