import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';
import ReservationCard from '../../components/ReservationCard';

const ClientDashboard = () => {
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const [rooms, setRooms]             = useState([]);
  const [reservations, setReservations] = useState([]);
  const [view, setView]               = useState('rooms'); // 'rooms' | 'reservations'
  const [form, setForm]               = useState({ roomId: '', dateDebut: '', dateFin: '' });
  const [msg, setMsg]                 = useState({ type: '', text: '' });
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    roomService.getDisponibles().then(r => setRooms(r.data)).catch(() => {});
    reservationService.getMesReservations().then(r => setReservations(r.data)).catch(() => {});
  }, []);

  const handleReserver = async () => {
    if (!form.roomId || !form.dateDebut || !form.dateFin) {
      setMsg({ type: 'error', text: 'Remplis tous les champs' });
      return;
    }
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await reservationService.create({
        roomId: parseInt(form.roomId),
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
      });
      setMsg({ type: 'success', text: 'Réservation créée avec succès !' });
      setForm({ roomId: '', dateDebut: '', dateFin: '' });
      const res = await reservationService.getMesReservations();
      setReservations(res.data);
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.message || 'Erreur' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnnuler = async (id) => {
    if (!confirm('Annuler cette réservation ?')) return;
    try {
      await reservationService.annuler(id);
      const res = await reservationService.getMesReservations();
      setReservations(res.data);
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 border-b border-blue-600">
          <h1 className="text-xl font-bold">🏨 Mon Espace</h1>
          <p className="text-blue-200 text-sm mt-1">{user?.nom}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setView('rooms')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
              view === 'rooms' ? 'bg-blue-500' : 'hover:bg-blue-600'
            }`}
          >
            🛏 Réserver une chambre
          </button>
          <button
            onClick={() => setView('reservations')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
              view === 'reservations' ? 'bg-blue-500' : 'hover:bg-blue-600'
            }`}
          >
            📋 Mes réservations ({reservations.length})
          </button>
        </nav>
        <div className="p-4 border-t border-blue-600">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-600 text-sm transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {view === 'rooms' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Réserver une chambre</h2>

            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 max-w-lg">
              <h3 className="font-semibold text-gray-700 mb-4">Nouvelle réservation</h3>

              {msg.text && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${
                  msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {msg.text}
                </div>
              )}

              <select
                className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.roomId}
                onChange={e => setForm({ ...form, roomId: e.target.value })}
              >
                <option value="">-- Choisir une chambre --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Chambre {r.numero} — {r.type} — {r.prixParNuit} MAD/nuit
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.dateDebut}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, dateDebut: e.target.value })}
              />

              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2 mb-5 focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.dateFin}
                min={form.dateDebut || new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, dateFin: e.target.value })}
              />

              {form.roomId && form.dateDebut && form.dateFin && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm text-blue-700">
                  💰 Total estimé :{' '}
                  <strong>
                    {Math.max(0,
                      Math.ceil((new Date(form.dateFin) - new Date(form.dateDebut)) / 86400000)
                    ) * (rooms.find(r => r.id == form.roomId)?.prixParNuit || 0)} MAD
                  </strong>
                </div>
              )}

              <button
                onClick={handleReserver}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'En cours...' : 'Confirmer la réservation'}
              </button>
            </div>

            {/* Chambres disponibles */}
            <h3 className="font-semibold text-gray-700 mb-3">Chambres disponibles ({rooms.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(r => (
                <div
                  key={r.id}
                  onClick={() => setForm(f => ({ ...f, roomId: String(r.id) }))}
                  className={`bg-white rounded-xl shadow p-4 cursor-pointer border-2 transition ${
                    form.roomId == r.id ? 'border-blue-500' : 'border-transparent hover:border-blue-200'
                  }`}
                >
                  <h4 className="font-bold text-gray-800">Chambre {r.numero}</h4>
                  <p className="text-sm text-gray-500">{r.type} — Étage {r.etage}</p>
                  <p className="text-blue-600 font-semibold mt-2">{r.prixParNuit} MAD / nuit</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'reservations' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Réservations</h2>
            {reservations.length === 0 ? (
              <p className="text-gray-400 text-center mt-16">Aucune réservation pour l'instant.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map(r => (
                  <ReservationCard
                    key={r.id}
                    reservation={r}
                    isAdmin={false}
                    onAnnuler={handleAnnuler}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;