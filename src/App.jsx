import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";
import Admission from "./pages/public/Admission";
import Tour from "./pages/public/Tour";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import TeacherLayout from "./pages/teacher/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import UploadMaterial from "./pages/teacher/UploadMaterial";
import UploadResult from "./pages/teacher/UploadResult";
import TeacherProfile from "./pages/teacher/TeacherProfile";

import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Attendance from "./pages/student/Attendance";
import Results from "./pages/student/Results";
import Fees from "./pages/student/Fees";
import StudyMaterial from "./pages/student/StudyMaterial";
import ExamSchedule from "./pages/student/ExamSchedule";
import StudentProfile from "./pages/student/StudentProfile";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import FeeManagement from "./pages/admin/FeeManagement";
import TimetableManagement from "./pages/admin/TimetableManagement";
import ResultsOverview from "./pages/admin/ResultsOverview";
import NoticeBoard from "./pages/admin/NoticeBoard";
import GalleryManage from "./pages/admin/GalleryManage";
import Enquiries from "./pages/admin/Enquiries";
import AdminProfile from "./pages/admin/AdminProfile";

const Unauthorized = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="rounded-xl bg-white p-8 text-center shadow-card">
      <h1 className="font-heading text-3xl text-primary">Unauthorized</h1>
      <p className="mt-2 text-slate-600">You do not have permission to access this page.</p>
    </div>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/gallery" element={<Gallery />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/admission" element={<Admission />} />
    <Route path="/tour" element={<Tour />} />

    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    <Route
      path="/teacher"
      element={
        <ProtectedRoute role="teacher">
          <TeacherLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="attendance" element={<MarkAttendance />} />
      <Route path="material" element={<UploadMaterial />} />
      <Route path="result" element={<UploadResult />} />
      <Route path="profile" element={<TeacherProfile />} />
    </Route>

    <Route
      path="/student"
      element={
        <ProtectedRoute role="student">
          <StudentLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="results" element={<Results />} />
      <Route path="fees" element={<Fees />} />
      <Route path="materials" element={<StudyMaterial />} />
      <Route path="exams" element={<ExamSchedule />} />
      <Route path="profile" element={<StudentProfile />} />
    </Route>

    <Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="students" element={<ManageStudents />} />
      <Route path="teachers" element={<ManageTeachers />} />
      <Route path="timetable" element={<TimetableManagement />} />
      <Route path="fees" element={<FeeManagement />} />
      <Route path="results" element={<ResultsOverview />} />
      <Route path="notices" element={<NoticeBoard />} />
      <Route path="gallery" element={<GalleryManage />} />
      <Route path="enquiries" element={<Enquiries />} />
      <Route path="profile" element={<AdminProfile />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
