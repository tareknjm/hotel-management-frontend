const statusColors = {
  DISPONIBLE:    'bg-green-100 text-green-700',
  OCCUPEE:       'bg-red-100 text-red-700',
  EN_NETTOYAGE:  'bg-yellow-100 text-yellow-700',
  HORS_SERVICE:  'bg-gray-100 text-gray-700',
};

const RoomCard = ({ room, onEdit, onDelete, onStatut, isAdmin }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Chambre {room.numero}</h3>
          <p className="text-sm text-gray-500">{room.type} — Étage {room.etage}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[room.statut]}`}>
          {room.statut}
        </span>
      </div>

      <p className="text-blue-600 font-semibold">{room.prixParNuit} MAD / nuit</p>

      {isAdmin && (
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 border border-blue-500 text-blue-600 rounded-lg py-1 text-sm hover:bg-blue-50 transition"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="flex-1 border border-red-400 text-red-500 rounded-lg py-1 text-sm hover:bg-red-50 transition"
          >
            Supprimer
          </button>
        </div>
      )}

      <select
        className="border rounded-lg px-2 py-1 text-sm text-gray-600"
        value={room.statut}
        onChange={e => onStatut(room.id, e.target.value)}
      >
        <option value="DISPONIBLE">Disponible</option>
        <option value="OCCUPEE">Occupée</option>
        <option value="EN_NETTOYAGE">En nettoyage</option>
        <option value="HORS_SERVICE">Hors service</option>
      </select>
    </div>
  );
};

export default RoomCard;