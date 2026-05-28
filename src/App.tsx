import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import type { UserRole } from "@/types/user";
import { AppLayout } from "@/components/AppLayout";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import MySubmissionsPage from "@/pages/MySubmissionsPage";
import MyPublicationsPage from "@/pages/MyPublicationsPage";
import MyReservationsPage from "@/pages/MyReservationsPage";
import SubmitProjectPage from "@/pages/SubmitProjectPage";
import SubmitPublicationPage from "@/pages/SubmitPublicationPage";
import SupervisedStudentsPage from "@/pages/SupervisedStudentsPage";
import ModerationPage from "@/pages/ModerationPage";
import NotificationsPage from "@/pages/NotificationsPage";

import TeachingLogPage from "@/pages/TeachingLogPage";
import HodExamReviewPage from "@/pages/HodExamReviewPage";
import HodReportsPage from "@/pages/HodReportsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminReservationsPage from "@/pages/admin/AdminReservationsPage";
import AdminSchedulePage from "@/pages/admin/AdminSchedulePage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import NotFound from "@/pages/NotFound";

import MyDocumentsPage from "@/pages/MyDocumentsPage";
import MyAttendancePage from "@/pages/MyAttendancePage";
import SubmitDocumentPage from "@/pages/SubmitDocumentPage";
import AttendanceManagementPage from "@/pages/AttendanceManagementPage";
import ExamOfficePage from "@/pages/ExamOfficePage";
import LecturerCourseMaterialsPage from "@/pages/lecturer/LecturerCourseMaterialsPage";
import LecturerMarksEntryPage from "@/pages/lecturer/LecturerMarksEntryPage";
import ExamUploadPage from "@/pages/ExamUploadPage";
import HodInternshipsPage from "@/pages/hod/HodInternshipsPage";
import HodProjectSupervisionPage from "@/pages/hod/HodProjectSupervisionPage";
import HodGraduationListPage from "@/pages/hod/HodGraduationListPage";
import HodTeachingProgressPage from "@/pages/hod/HodTeachingProgressPage";
import HodMarksModeration from "@/pages/hod/HodMarksModeration";
import HodCurriculumPage from "@/pages/hod/HodCurriculumPage";
import DocumentVerificationPage from "@/pages/DocumentVerificationPage";
import ResearchShowcasePage from "@/pages/ResearchShowcasePage";


const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AuthenticatedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* ─── Public ─── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      

      {/* ─── Authenticated Wrapper ─── */}
      <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/publications/:id" element={<ProjectDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />


        {/* Student Records */}
        <Route path="/my-documents" element={<ProtectedRoute allowedRoles={["student"]}><MyDocumentsPage /></ProtectedRoute>} />
        <Route path="/my-submissions" element={<ProtectedRoute allowedRoles={["student"]}><MySubmissionsPage /></ProtectedRoute>} />
        <Route path="/submit/project" element={<ProtectedRoute allowedRoles={["student"]}><SubmitProjectPage /></ProtectedRoute>} />
        <Route path="/submit/document" element={<ProtectedRoute allowedRoles={["student"]}><SubmitDocumentPage /></ProtectedRoute>} />
        <Route path="/my-attendance" element={<ProtectedRoute allowedRoles={["student"]}><MyAttendancePage /></ProtectedRoute>} />
        <Route path="/my-reservations" element={<ProtectedRoute allowedRoles={["student", "lecturer", "moderator"]}><MyReservationsPage /></ProtectedRoute>} />

        {/* Lecturer Office */}
        <Route path="/my-publications" element={<ProtectedRoute allowedRoles={["lecturer"]}><MyPublicationsPage /></ProtectedRoute>} />
        <Route path="/submit/publication" element={<ProtectedRoute allowedRoles={["lecturer"]}><SubmitPublicationPage /></ProtectedRoute>} />
        <Route path="/teaching-log" element={<ProtectedRoute allowedRoles={["lecturer"]}><TeachingLogPage /></ProtectedRoute>} />
        <Route path="/attendance-management" element={<ProtectedRoute allowedRoles={["lecturer"]}><AttendanceManagementPage /></ProtectedRoute>} />
        <Route path="/exam-upload" element={<ProtectedRoute allowedRoles={["lecturer"]}><ExamUploadPage /></ProtectedRoute>} />
        <Route path="/exam-upload/:step" element={<ProtectedRoute allowedRoles={["lecturer"]}><ExamUploadPage /></ProtectedRoute>} />
        <Route path="/course-materials" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerCourseMaterialsPage /></ProtectedRoute>} />
        <Route path="/marks-entry" element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerMarksEntryPage /></ProtectedRoute>} />
        <Route path="/supervised" element={<ProtectedRoute allowedRoles={["lecturer"]}><SupervisedStudentsPage /></ProtectedRoute>} />

        {/* HOD Office */}
        <Route path="/hod/exam-review" element={<ProtectedRoute allowedRoles={["hod"]}><HodExamReviewPage /></ProtectedRoute>} />
        <Route path="/hod/attendance" element={<ProtectedRoute allowedRoles={["hod"]}><AttendanceManagementPage /></ProtectedRoute>} />
        <Route path="/hod/reports" element={<ProtectedRoute allowedRoles={["hod"]}><HodReportsPage /></ProtectedRoute>} />
        <Route path="/hod/eligibility" element={<ProtectedRoute allowedRoles={["hod"]}><ExamOfficePage /></ProtectedRoute>} />
        <Route path="/hod/internships" element={<ProtectedRoute allowedRoles={["hod"]}><HodInternshipsPage /></ProtectedRoute>} />
        <Route path="/hod/projects" element={<ProtectedRoute allowedRoles={["hod"]}><HodProjectSupervisionPage /></ProtectedRoute>} />
        <Route path="/hod/graduations" element={<ProtectedRoute allowedRoles={["hod"]}><HodGraduationListPage /></ProtectedRoute>} />
        <Route path="/hod/teaching-progress" element={<ProtectedRoute allowedRoles={["hod"]}><HodTeachingProgressPage /></ProtectedRoute>} />
        <Route path="/hod/marks-moderation" element={<ProtectedRoute allowedRoles={["hod"]}><HodMarksModeration /></ProtectedRoute>} />
        <Route path="/hod/curriculum" element={<ProtectedRoute allowedRoles={["hod"]}><HodCurriculumPage /></ProtectedRoute>} />

        <Route path="/exam-office/timetable" element={<ProtectedRoute allowedRoles={["hod", "admin", "exam_office"]}><ExamOfficePage /></ProtectedRoute>} />
        <Route path="/exam-office/approved" element={<ProtectedRoute allowedRoles={["hod", "admin", "exam_office"]}><ExamOfficePage /></ProtectedRoute>} />
        <Route path="/exam-office/invigilators" element={<ProtectedRoute allowedRoles={["hod", "admin", "exam_office"]}><ExamOfficePage /></ProtectedRoute>} />
        <Route path="/exam-office/venues" element={<ProtectedRoute allowedRoles={["hod", "admin", "exam_office"]}><ExamOfficePage /></ProtectedRoute>} />
        <Route path="/exam-office/clashes" element={<ProtectedRoute allowedRoles={["hod", "admin", "exam_office"]}><ExamOfficePage /></ProtectedRoute>} />
        <Route path="/exam-office/eligibility" element={<ProtectedRoute allowedRoles={["hod", "admin", "exam_office"]}><ExamOfficePage /></ProtectedRoute>} />

        {/* Library / Moderator */}
        <Route path="/moderation/*" element={<ProtectedRoute allowedRoles={["moderator", "admin"]}><ModerationPage /></ProtectedRoute>} />
        <Route path="/document-verification" element={<ProtectedRoute allowedRoles={["moderator", "admin"]}><DocumentVerificationPage /></ProtectedRoute>} />
        <Route path="/browse" element={<ProtectedRoute allowedRoles={["student", "lecturer", "hod", "moderator", "admin", "exam_office"]}><ResearchShowcasePage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/reservations" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReservationsPage /></ProtectedRoute>} />
        <Route path="/admin/schedule" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSchedulePage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReportsPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettingsPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="relative min-h-screen">
              <div className="app-grid-overlay" aria-hidden />
              <div className="relative z-[1] min-h-screen">
                <AppErrorBoundary>
                  <AppRoutes />
                </AppErrorBoundary>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
