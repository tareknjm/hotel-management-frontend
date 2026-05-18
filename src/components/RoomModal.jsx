import { useState, useEffect } from 'react';

const RoomModal = ({ room, onSave, onClose }) => {
  const [form, setForm] = useState({
    numero: '', type: 'SIMPLE', etage: 1, prixParNuit: 0,
  });

  useEffect(() => {
    if (room) setForm({
      numero:     room.numero,
      type:       room.type,
      etage:      room.etage,
      prixParNuit: room.prixParNuit,
    });
  }, [room]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          {room ? 'Modifier la chambre' : 'Nouvelle chambre'}
        </h2>

        <input
          placeholder="Numéro (ex: 101)"
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.numero}
          onChange={e => setForm({ ...form, numero: e.target.value })}
        />

        <select
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="SIMPLE">Simple</option>
          <option value="DOUBLE">Double</option>
          <option value="SUITE">Suite</option>
          <option value="DELUXE">Deluxe</option>
        </select>

        <input
          type="number"
          placeholder="Étage"
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.etage}
          onChange={e => setForm({ ...form, etage: parseInt(e.target.value) })}
        />

        <input
          type="number"
          placeholder="Prix par nuit (MAD)"
          className="w-full border rounded-lg px-4 py-2 mb-5 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.prixParNuit}
          onChange={e => setForm({ ...form, prixParNuit: parseFloat(e.target.value) })}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;