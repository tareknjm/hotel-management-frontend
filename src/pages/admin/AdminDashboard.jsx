import { useAuth } from '../../context/AuthContext';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold">🏨 Hôtel Admin</h1>
          <p className="text-blue-300 text-sm mt-1">{user?.nom}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/admin/rooms"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition text-sm ${
                isActive ? 'bg-blue-600' : 'hover:bg-blue-700'
              }`
            }
          >
            🛏 Chambres
          </NavLink>
          <NavLink
            to="/admin/reservations"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition text-sm ${
                isActive ? 'bg-blue-600' : 'hover:bg-blue-700'
              }`
            }
          >
            📋 Réservations
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition text-sm ${
                isActive ? 'bg-blue-600' : 'hover:bg-blue-700'
              }`
            }
          >
            👥 Utilisateurs
          </NavLink>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;