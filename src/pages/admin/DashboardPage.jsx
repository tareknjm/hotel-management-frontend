import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  if (!stats) return (
    <div className="p-6 text-red-500">Erreur chargement des statistiques.</div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

      {/* Stats chambres */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">Chambres</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🏨" label="Total chambres"     value={stats.totalChambres}      color="border-blue-500" />
        <StatCard icon="✅" label="Disponibles"        value={stats.chambresDisponibles} color="border-green-500" />
        <StatCard icon="🔴" label="Occupées"           value={stats.chambresOccupees}    color="border-red-400" />
      </div>

      {/* Stats réservations */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">Réservations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📋" label="Total réservations"  value={stats.totalReservations}      color="border-purple-500" />
        <StatCard icon="⏳" label="En attente"          value={stats.reservationsEnAttente}   color="border-yellow-400" />
        <StatCard icon="✓"  label="Confirmées"          value={stats.reservationsConfirmees}  color="border-green-500" />
      </div>

      {/* Stats finances & clients */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">Finances & Clients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard icon="👥" label="Total clients"  value={stats.totalClients}              color="border-blue-400" />
        <StatCard icon="💰" label="Revenu total"   value={`${stats.revenuTotal} MAD`}      color="border-emerald-500" />
      </div>

      {/* Barre occupation */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Taux d'occupation</h3>
        <div className="w-full bg-gray-100 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{
              width: stats.totalChambres > 0
                ? `${(stats.chambresOccupees / stats.totalChambres) * 100}%`
                : '0%'
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.totalChambres > 0
            ? `${Math.round((stats.chambresOccupees / stats.totalChambres) * 100)}% des chambres occupées`
            : 'Aucune chambre enregistrée'}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;