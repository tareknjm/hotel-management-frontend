import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage        from './pages/public/HomePage';
import LoginPage       from './pages/public/LoginPage';
import RegisterPage    from './pages/public/RegisterPage';
import AdminDashboard  from './pages/admin/AdminDashboard';
import RoomsPage       from './pages/admin/RoomsPage';
import ClientDashboard from './pages/client/ClientDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin layout avec sidebar */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="dashboard" element={<div className="p-6"><h2 className="text-xl font-bold">Bienvenue !</h2></div>} />
          <Route path="rooms"     element={<RoomsPage />} />
        </Route>

        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;