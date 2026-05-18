import { useAuth } from '../../context/AuthContext';
import { useNavigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/admin/dashboard',    icon: '◈', label: 'Dashboard'    },
  { to: '/admin/rooms',        icon: '⊞', label: 'Chambres'     },
  { to: '/admin/reservations', icon: '◷', label: 'Réservations' },
  { to: '/admin/users',        icon: '◉', label: 'Utilisateurs' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy">

      {/* Sidebar */}
      <aside className={`relative flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
        style={{ background: '#1E293B', borderRight: '1px solid rgba(255,255,255,0.04)' }}>

        {/* Logo */}
        <div className={`p-5 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-gold"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            <span className="text-navy font-bold text-sm">E</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <p className="font-display font-bold text-white text-sm">EasyHotel</p>
              <p className="text-white/30 text-xs">Administration</p>
            </div>
          )}
        </div>

        {/* Collapse btn */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-xs">{collapsed ? '›' : '‹'}</span>
        </button>

        {/* User */}
        {!collapsed && (
          <div className="mx-4 mt-4 p-3 rounded-xl animate-fade-in"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-navy text-sm"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                {user?.nom?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.nom}</p>
                <p className="text-gold text-xs">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 mt-2 space-y-1">
          {navItems.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <NavLink key={to} to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${collapsed ? 'justify-center' : ''}`}
                style={{
                  background: active ? 'rgba(245,158,11,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                }}>
                <span className="text-lg transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
                  style={{ color: active ? '#F59E0B' : 'rgba(255,255,255,0.35)' }}>
                  {icon}
                </span>
                {!collapsed && (
                  <span className="text-sm font-medium transition-colors duration-200"
                    style={{ color: active ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>
                    {label}
                  </span>
                )}
                {active && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button onClick={() => { logout(); navigate('/login'); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}>
            <span className="text-lg flex-shrink-0">⎋</span>
            {!collapsed && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" style={{ background: '#0F172A' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;