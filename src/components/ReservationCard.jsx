const statusColors = {
  EN_ATTENTE:  'bg-yellow-100 text-yellow-700',
  CONFIRMEE:   'bg-green-100 text-green-700',
  ANNULEE:     'bg-red-100 text-red-700',
};

const ReservationCard = ({ reservation, onStatut, onAnnuler, isAdmin }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800">
            Chambre {reservation.roomNumero}
            <span className="text-gray-400 font-normal text-sm ml-2">({reservation.roomType})</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {reservation.userNom} {reservation.userPrenom}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[reservation.statut]}`}>
          {reservation.statut}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>📅 Du <strong>{reservation.dateDebut}</strong> au <strong>{reservation.dateFin}</strong></p>
        <p>🌙 {reservation.nombreNuits} nuit(s)</p>
        <p>💰 <strong>{reservation.prixTotal} MAD</strong></p>
      </div>

      {isAdmin && reservation.statut === 'EN_ATTENTE' && (
        <div className="flex gap-2">
          <button
            onClick={() => onStatut(reservation.id, 'CONFIRMEE')}
            className="flex-1 bg-green-500 text-white rounded-lg py-1.5 text-sm hover:bg-green-600 transition"
          >
            ✓ Confirmer
          </button>
          <button
            onClick={() => onStatut(reservation.id, 'ANNULEE')}
            className="flex-1 bg-red-400 text-white rounded-lg py-1.5 text-sm hover:bg-red-500 transition"
          >
            ✗ Annuler
          </button>
        </div>
      )}

      {!isAdmin && reservation.statut === 'EN_ATTENTE' && (
        <button
          onClick={() => onAnnuler(reservation.id)}
          className="w-full border border-red-400 text-red-500 rounded-lg py-1.5 text-sm hover:bg-red-50 transition"
        >
          Annuler ma réservation
        </button>
      )}
    </div>
  );
};

export default ReservationCard;