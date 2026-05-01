import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LazyLoader from "../components/common/LazyLoader";
import PageSkeleton from "../components/common/PageSkeleton";
import useGlobalButtonGuard from "../hooks/useGlobalButtonGuard";
import { AdminPages, AuthPages, FacultyPages, PublicPages, StudentPages } from "./lazyRoutes";

const Unauthorized = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="rounded-xl bg-white p-8 text-center shadow-card">
      <h1 className="font-heading text-3xl text-primary">Unauthorized</h1>
      <p className="mt-2 text-slate-600">You do not have permission to access this page.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="rounded-xl bg-white p-8 text-center shadow-card">
      <h1 className="font-heading text-3xl text-primary">404</h1>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
    </div>
  </div>
);

const AppRouter = () => {
  useGlobalButtonGuard();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
            <PublicPages.Home />
          </LazyLoader>
        }
      />
      <Route
        path="/about"
        element={
          <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
            <PublicPages.About />
          </LazyLoader>
        }
      />
      <Route
        path="/gallery"
        element={
          <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
            <PublicPages.Gallery />
          </LazyLoader>
        }
      />
      <Route
        path="/contact"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <PublicPages.Contact />
          </LazyLoader>
        }
      />
      <Route
        path="/admission"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <PublicPages.Admission />
          </LazyLoader>
        }
      />
      <Route
        path="/tour"
        element={
          <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
            <PublicPages.Tour />
          </LazyLoader>
        }
      />

      <Route
        path="/login"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <AuthPages.Login />
          </LazyLoader>
        }
      />
      <Route
        path="/register"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <AuthPages.Register />
          </LazyLoader>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <AuthPages.ForgotPassword />
          </LazyLoader>
        }
      />
      <Route
        path="/reset-password"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <AuthPages.ResetPassword />
          </LazyLoader>
        }
      />
      <Route
        path="/verify-email"
        element={
          <LazyLoader fallback={<PageSkeleton variant="form" />}>
            <AuthPages.VerifyEmail />
          </LazyLoader>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
              <FacultyPages.FacultyLayout />
            </LazyLoader>
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
              <FacultyPages.FacultyDashboard />
            </LazyLoader>
          }
        />
        <Route
          path="attendance"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <FacultyPages.MarkAttendance />
            </LazyLoader>
          }
        />
        <Route
          path="material"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <FacultyPages.SubjectDetails />
            </LazyLoader>
          }
        />
        <Route
          path="subjects"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <FacultyPages.SubjectDetails />
            </LazyLoader>
          }
        />
        <Route
          path="result"
          element={
            <LazyLoader fallback={<PageSkeleton variant="form" />}>
              <FacultyPages.UploadMarks />
            </LazyLoader>
          }
        />
        <Route
          path="profile"
          element={
            <LazyLoader fallback={<PageSkeleton variant="profile" />}>
              <FacultyPages.TeacherProfile />
            </LazyLoader>
          }
        />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
              <StudentPages.StudentLayout />
            </LazyLoader>
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
              <StudentPages.StudentDashboard />
            </LazyLoader>
          }
        />
        <Route
          path="attendance"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.ViewAttendance />
            </LazyLoader>
          }
        />
        <Route
          path="results"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.ViewMarks />
            </LazyLoader>
          }
        />
        <Route
          path="fees"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.Fees />
            </LazyLoader>
          }
        />
        <Route
          path="materials"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.SubjectDetails />
            </LazyLoader>
          }
        />
        <Route
          path="subjects"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.SubjectDetails />
            </LazyLoader>
          }
        />
        <Route
          path="exams"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.Timetable />
            </LazyLoader>
          }
        />
        <Route
          path="admit-cards"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <StudentPages.MyAdmitCardsPage />
            </LazyLoader>
          }
        />
        <Route
          path="profile"
          element={
            <LazyLoader fallback={<PageSkeleton variant="profile" />}>
              <StudentPages.Profile />
            </LazyLoader>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
              <AdminPages.AdminLayout />
            </LazyLoader>
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <LazyLoader fallback={<PageSkeleton variant="dashboard" />}>
              <AdminPages.AdminDashboard />
            </LazyLoader>
          }
        />
        <Route
          path="exams/create"
          element={
            <LazyLoader fallback={<PageSkeleton variant="form" />}>
              <AdminPages.CreateExamPage />
            </LazyLoader>
          }
        />
        <Route
          path="exams/:examId"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.AdmitCardManagerPage />
            </LazyLoader>
          }
        />
        <Route
          path="students"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.ManageStudents />
            </LazyLoader>
          }
        />
        <Route
          path="teachers"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.ManageFaculty />
            </LazyLoader>
          }
        />
        <Route
          path="timetable"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.ManageCourses />
            </LazyLoader>
          }
        />
        <Route
          path="subjects"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.SubjectMaster />
            </LazyLoader>
          }
        />
        <Route
          path="fees"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.ManageFees />
            </LazyLoader>
          }
        />
        <Route
          path="results"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.Reports />
            </LazyLoader>
          }
        />
        <Route
          path="notices"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.NoticeBoard />
            </LazyLoader>
          }
        />
        <Route
          path="gallery"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.GalleryManage />
            </LazyLoader>
          }
        />
        <Route
          path="enquiries"
          element={
            <LazyLoader fallback={<PageSkeleton variant="table" />}>
              <AdminPages.AuditLogs />
            </LazyLoader>
          }
        />
        <Route
          path="profile"
          element={
            <LazyLoader fallback={<PageSkeleton variant="profile" />}>
              <AdminPages.Settings />
            </LazyLoader>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/legacy/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
