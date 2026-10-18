import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import AccountPage from './pages/shared/AccountPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import InventoryPage from './pages/admin/InventoryPage';
import RequestsPage from './pages/admin/RequestsPage';
import DonorsPage from './pages/admin/DonorsPage';
import PatientsPage from './pages/admin/PatientsPage';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import RegisterAdminPage from './pages/admin/RegisterAdminPage';
import DonorLayout from './layouts/DonorLayout';
import DonorDashboard from './pages/donor/DonorDashboard';
import PatientLayout from './layouts/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="Admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="donors" element={<DonorsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="register-admin" element={<RegisterAdminPage />} />
          </Route>

          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRole="Donor">
                <DonorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRole="Patient">
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* Catch-all: any unmatched URL shows the 404 page instead of a blank screen */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
