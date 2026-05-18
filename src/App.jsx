import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage              from './pages/public/HomePage';
import LoginPage             from './pages/public/LoginPage';
import RegisterPage          from './pages/public/RegisterPage';
import UnauthorizedPage      from './pages/public/UnauthorizedPage';
import NotFoundPage          from './pages/public/NotFoundPage';

import ProtectedRoute        from './routes/ProtectedRoute';
import AdminDashboard        from './pages/admin/AdminDashboard';
import DashboardPage         from './pages/admin/DashboardPage';
import RoomsPage             from './pages/admin/RoomsPage';
import ReservationsAdminPage from './pages/admin/ReservationsAdminPage';
import UsersPage             from './pages/admin/UsersPage';

import ClientDashboard       from './pages/client/ClientDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"             element={<HomePage />} />
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/register"     element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin — protégé ADMIN uniquement */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['ADMIN', 'RECEPTIONNISTE']}>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="dashboard"    element={<DashboardPage />} />
          <Route path="rooms"        element={<RoomsPage />} />
          <Route path="reservations" element={<ReservationsAdminPage />} />
          <Route path="users"        element={
            <ProtectedRoute roles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Client — protégé tous les connectés */}
        <Route path="/client/dashboard" element={
          <ProtectedRoute roles={['CLIENT']}>
            <ClientDashboard />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;