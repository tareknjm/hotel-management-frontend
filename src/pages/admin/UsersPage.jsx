import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const roleConfig = {
  ADMIN:          { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Admin'           },
  RECEPTIONNISTE: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  label: 'Réceptionniste'  },
  CLIENT:         { color: '#6B7280', bg: 'rgba(107,114,128,0.08)', label: 'Client'          },
};

const UsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [focused, setFocused] = useState(false);

  const fetchUsers = async () => {
    try { const res = await adminService.getUsers(); setUsers(res.data); }
    catch { alert('Erreur chargement utilisateurs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRole = async (id, role) => {
    try { await adminService.updateRole(id, role); fetchUsers(); }
    catch (e) { alert(e.response?.data?.message || 'Erreur'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try { await adminService.deleteUser(id); fetchUsers(); }
    catch (e) { alert(e.response?.data?.message || 'Erreur'); }
  };

  const filtered = users.filter(u =>
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 opacity-0 animate-fade-up">
        <div>
          <p className="text-gold text-sm uppercase tracking-widest mb-1">Gestion</p>
          <h1 className="font-display text-4xl font-bold text-white">Utilisateurs</h1>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/30"
          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}>
          <span>{users.length} compte(s)</span>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-6 opacity-0 animate-fade-up delay-100">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">🔍</span>
          <input type="text" placeholder="Rechercher par nom, email..."
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 text-sm"
            style={{
              background: '#1E293B',
              border: focused ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(255,255,255,0.06)',
              boxShadow: focused ? '0 0 0 3px rgba(245,158,11,0.08)' : 'none',
            }} />
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-2xl overflow-hidden opacity-0 animate-fade-up delay-200"
        style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs uppercase tracking-widest text-white/20"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="col-span-4">Utilisateur</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Rôle</div>
          <div className="col-span-3">Actions</div>
        </div>

        {filtered.map((u, i) => {
          const r = roleConfig[u.role];
          return (
            <div key={u.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-150 hover:bg-white/[0.02]"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', animationDelay: `${i * 0.04}s` }}>

              {/* Avatar + nom */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-navy text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  {u.nom?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{u.nom} {u.prenom}</p>
                  <p className="text-white/25 text-xs">ID #{u.id}</p>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-3">
                <p className="text-white/50 text-sm truncate">{u.email}</p>
              </div>

              {/* Rôle badge */}
              <div className="col-span-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: r.bg, color: r.color }}>
                  {r.label}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center gap-2">
                <select value={u.role} onChange={e => handleRole(u.id, e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                  <option value="CLIENT">CLIENT</option>
                  <option value="RECEPTIONNISTE">RECEPTIONNISTE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button onClick={() => handleDelete(u.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(239,68,68,0.06)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.1)' }}>
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-white/25 text-sm">Aucun utilisateur trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;