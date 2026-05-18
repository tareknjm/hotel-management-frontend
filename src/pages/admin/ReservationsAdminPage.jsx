import { useEffect, useState } from 'react';
import { reservationService } from '../../services/reservationService';
import ReservationCard from '../../components/ReservationCard';

const filters = ['TOUTES', 'EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'];

const ReservationsAdminPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtre, setFiltre]             = useState('TOUTES');

  const fetchAll = async () => {
    try {
      const res = await reservationService.getAll();
      setReservations(res.data);
    } catch {
      alert('Erreur chargement réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleStatut = async (id, statut) => {
    try {
      await reservationService.updateStatut(id, statut);
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const filtered = filtre === 'TOUTES'
    ? reservations
    : reservations.filter(r => r.statut === filtre);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Réservations</h1>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filtre === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f} {f === 'TOUTES' ? `(${reservations.length})` : `(${reservations.filter(r => r.statut === f).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <ReservationCard
            key={r.id}
            reservation={r}
            isAdmin={true}
            onStatut={handleStatut}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-16">Aucune réservation.</p>
      )}
    </div>
  );
};

export default ReservationsAdminPage;