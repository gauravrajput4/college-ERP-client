import DashboardLayout from "../../components/DashboardLayout";

const links = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "Attendance", to: "/student/attendance" },
  { label: "Results", to: "/student/results" },
  { label: "Fees", to: "/student/fees" },
  { label: "Subjects", to: "/student/subjects" },
  { label: "Exam Schedule", to: "/student/exams" },
  { label: "Profile", to: "/student/profile" },
];

const StudentLayout = () => {
  return (
    <DashboardLayout
      roleLabel="Student"
      sidebarTitle="Student Panel"
      links={links}
      settingsTo="/student/profile"
      hidePageHeaderOn={["/student/dashboard"]}
    />
  );
};

export default StudentLayout;
