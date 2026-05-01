import { lazy } from "react";

const lazyImport = (importer) => {
  const Component = lazy(importer);
  Component.preload = importer;
  return Component;
};

export const authLoaders = {
  Login: () => import(/* webpackChunkName: "auth" */ "../pages/auth/Login"),
  Register: () => import(/* webpackChunkName: "auth" */ "../pages/auth/Register"),
  ForgotPassword: () => import(/* webpackChunkName: "auth" */ "../pages/auth/ForgotPassword"),
  ResetPassword: () => import(/* webpackChunkName: "auth" */ "../pages/auth/ResetPassword"),
  VerifyEmail: () => import(/* webpackChunkName: "auth" */ "../pages/auth/VerifyEmail"),
};

export const adminLoaders = {
  AdminLayout: () => import(/* webpackChunkName: "admin" */ "../pages/admin/AdminLayout"),
  AdminDashboard: () => import(/* webpackChunkName: "admin" */ "../pages/admin/AdminDashboard"),
  CreateExamPage: () => import(/* webpackChunkName: "admin" */ "../pages/admin/CreateExamPage"),
  AdmitCardManagerPage: () => import(/* webpackChunkName: "admin" */ "../pages/admin/AdmitCardManagerPage"),
  ManageStudents: () => import(/* webpackChunkName: "admin" */ "../pages/admin/StudentsList"),
  ManageFaculty: () => import(/* webpackChunkName: "admin" */ "../pages/admin/ManageTeachers"),
  ManageCourses: () => import(/* webpackChunkName: "admin" */ "../pages/admin/TimetableManagement"),
  SubjectMaster: () => import(/* webpackChunkName: "admin" */ "../pages/admin/SubjectMaster"),
  ManageFees: () => import(/* webpackChunkName: "admin" */ "../pages/admin/FeeManagement"),
  Reports: () => import(/* webpackChunkName: "admin" */ "../pages/admin/ResultsOverview"),
  Settings: () => import(/* webpackChunkName: "admin" */ "../pages/admin/AdminProfile"),
  AuditLogs: () => import(/* webpackChunkName: "admin" */ "../pages/admin/Enquiries"),
  NoticeBoard: () => import(/* webpackChunkName: "admin" */ "../pages/admin/NoticeBoard"),
  GalleryManage: () => import(/* webpackChunkName: "admin" */ "../pages/admin/GalleryManage"),
};

export const facultyLoaders = {
  FacultyLayout: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/TeacherLayout"),
  FacultyDashboard: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/TeacherDashboard"),
  MarkAttendance: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/MarkAttendance"),
  UploadMarks: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/UploadResult"),
  SubjectDetails: () => import(/* webpackChunkName: "faculty" */ "../pages/SubjectDetails"),
  ViewStudents: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/MarkAttendance"),
  Timetable: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/UploadMaterial"),
  UploadMaterial: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/UploadMaterial"),
  TeacherProfile: () => import(/* webpackChunkName: "faculty" */ "../pages/teacher/TeacherProfile"),
};

export const studentLoaders = {
  StudentLayout: () => import(/* webpackChunkName: "student" */ "../pages/student/StudentLayout"),
  StudentDashboard: () => import(/* webpackChunkName: "student" */ "../pages/student/StudentDashboard"),
  MyAdmitCardsPage: () => import(/* webpackChunkName: "student" */ "../pages/student/MyAdmitCardsPage"),
  ViewAttendance: () => import(/* webpackChunkName: "student" */ "../pages/student/Attendance"),
  ViewMarks: () => import(/* webpackChunkName: "student" */ "../pages/student/Results"),
  SubjectDetails: () => import(/* webpackChunkName: "student" */ "../pages/SubjectDetails"),
  Timetable: () => import(/* webpackChunkName: "student" */ "../pages/student/ExamSchedule"),
  Notices: () => import(/* webpackChunkName: "student" */ "../pages/student/StudyMaterial"),
  Profile: () => import(/* webpackChunkName: "student" */ "../pages/student/StudentProfile"),
  Fees: () => import(/* webpackChunkName: "student" */ "../pages/student/Fees"),
};

export const publicLoaders = {
  Home: () => import("../pages/public/Home"),
  About: () => import("../pages/public/About"),
  Gallery: () => import("../pages/public/Gallery"),
  Contact: () => import("../pages/public/Contact"),
  Admission: () => import("../pages/public/Admission"),
  Tour: () => import("../pages/public/Tour"),
};

export const AuthPages = Object.fromEntries(
  Object.entries(authLoaders).map(([name, loader]) => [name, lazyImport(loader)]),
);
export const AdminPages = Object.fromEntries(
  Object.entries(adminLoaders).map(([name, loader]) => [name, lazyImport(loader)]),
);
export const FacultyPages = Object.fromEntries(
  Object.entries(facultyLoaders).map(([name, loader]) => [name, lazyImport(loader)]),
);
export const StudentPages = Object.fromEntries(
  Object.entries(studentLoaders).map(([name, loader]) => [name, lazyImport(loader)]),
);
export const PublicPages = Object.fromEntries(
  Object.entries(publicLoaders).map(([name, loader]) => [name, lazyImport(loader)]),
);

const routePreloadMap = {
  "/": publicLoaders.Home,
  "/about": publicLoaders.About,
  "/gallery": publicLoaders.Gallery,
  "/contact": publicLoaders.Contact,
  "/admission": publicLoaders.Admission,
  "/tour": publicLoaders.Tour,
  "/login": authLoaders.Login,
  "/forgot-password": authLoaders.ForgotPassword,
  "/admin/dashboard": adminLoaders.AdminDashboard,
  "/admin/exams/create": adminLoaders.CreateExamPage,
  "/admin/students": adminLoaders.ManageStudents,
  "/admin/teachers": adminLoaders.ManageFaculty,
  "/admin/timetable": adminLoaders.ManageCourses,
  "/admin/subjects": adminLoaders.SubjectMaster,
  "/admin/fees": adminLoaders.ManageFees,
  "/admin/results": adminLoaders.Reports,
  "/admin/notices": adminLoaders.NoticeBoard,
  "/admin/gallery": adminLoaders.GalleryManage,
  "/admin/enquiries": adminLoaders.AuditLogs,
  "/admin/profile": adminLoaders.Settings,
  "/teacher/dashboard": facultyLoaders.FacultyDashboard,
  "/teacher/attendance": facultyLoaders.MarkAttendance,
  "/teacher/subjects": facultyLoaders.SubjectDetails,
  "/teacher/material": facultyLoaders.SubjectDetails,
  "/teacher/result": facultyLoaders.UploadMarks,
  "/teacher/profile": facultyLoaders.TeacherProfile,
  "/student/dashboard": studentLoaders.StudentDashboard,
  "/student/admit-cards": studentLoaders.MyAdmitCardsPage,
  "/student/attendance": studentLoaders.ViewAttendance,
  "/student/results": studentLoaders.ViewMarks,
  "/student/fees": studentLoaders.Fees,
  "/student/subjects": studentLoaders.SubjectDetails,
  "/student/materials": studentLoaders.SubjectDetails,
  "/student/exams": studentLoaders.Timetable,
  "/student/profile": studentLoaders.Profile,
};

export const preloadRouteChunk = (to) => {
  if (!to) return;
  const normalizedPath = String(to).split("?")[0];
  const loader = routePreloadMap[normalizedPath];
  if (loader) {
    loader();
  }
};
