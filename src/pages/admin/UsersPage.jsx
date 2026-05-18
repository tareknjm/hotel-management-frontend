import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const roleColors = {
  ADMIN:          'bg-red-100 text-red-700',
  RECEPTIONNISTE: 'bg-blue-100 text-blue-700',
  CLIENT:         'bg-gray-100 text-gray-600',
};

const UsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch {
      alert('Erreur chargement utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRole = async (id, role) => {
    try {
      await adminService.updateRole(id, role);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminService.deleteUser(id);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const filtered = users.filter(u =>
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Utilisateurs</h1>

      {/* Barre recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher par nom, prénom ou email..."
        className="w-full max-w-md border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-blue-400 outline-none"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rôle</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {u.nom} {u.prenom}
                </td>
                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={e => handleRole(u.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                      <option value="CLIENT">CLIENT</option>
                      <option value="RECEPTIONNISTE">RECEPTIONNISTE</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-400 hover:text-red-600 transition text-xs px-2 py-1 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;