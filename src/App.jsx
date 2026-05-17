import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage       from './pages/public/HomePage';
import LoginPage      from './pages/public/LoginPage';
import RegisterPage   from './pages/public/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                      element={<HomePage />} />
        <Route path="/login"                 element={<LoginPage />} />
        <Route path="/register"              element={<RegisterPage />} />
        <Route path="/admin/dashboard"       element={<AdminDashboard />} />
        <Route path="/client/dashboard"      element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;