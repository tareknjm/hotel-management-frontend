import { useAuth } from '../../context/AuthContext';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold">🏨 Hôtel Admin</h1>
          <p className="text-blue-300 text-sm mt-1">{user?.nom}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { to: '/admin/dashboard',    label: '📊 Dashboard'      },
            { to: '/admin/rooms',        label: '🛏 Chambres'        },
            { to: '/admin/reservations', label: '📋 Réservations'    },
            { to: '/admin/users',        label: '👥 Utilisateurs'    },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition text-sm ${
                  isActive ? 'bg-blue-600' : 'hover:bg-blue-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;