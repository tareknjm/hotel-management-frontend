import { useEffect, useState } from 'react';
import { roomService } from '../../services/roomService';
import RoomCard from '../../components/RoomCard';
import RoomModal from '../../components/RoomModal';

const RoomsPage = () => {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom]  = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await roomService.getAll();
      setRooms(res.data);
    } catch {
      setError('Erreur lors du chargement des chambres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSave = async (form) => {
    try {
      if (editRoom) {
        await roomService.update(editRoom.id, form);
      } else {
        await roomService.create(form);
      }
      setShowModal(false);
      setEditRoom(null);
      fetchRooms();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette chambre ?')) return;
    try {
      await roomService.delete(id);
      fetchRooms();
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const handleStatut = async (id, statut) => {
    try {
      await roomService.updateStatut(id, statut);
      fetchRooms();
    } catch (e) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Chambres</h1>
        <button
          onClick={() => { setEditRoom(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Nouvelle chambre
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            isAdmin={true}
            onEdit={(r) => { setEditRoom(r); setShowModal(true); }}
            onDelete={handleDelete}
            onStatut={handleStatut}
          />
        ))}
      </div>

      {rooms.length === 0 && !error && (
        <p className="text-center text-gray-400 mt-16">Aucune chambre enregistrée.</p>
      )}

      {showModal && (
        <RoomModal
          room={editRoom}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditRoom(null); }}
        />
      )}
    </div>
  );
};

export default RoomsPage;