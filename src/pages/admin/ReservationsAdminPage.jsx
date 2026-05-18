import { useEffect, useState } from 'react';
import { reservationService } from '../../services/reservationService';

const statusConfig = {
  EN_ATTENTE: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'En attente' },
  CONFIRMEE:  { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Confirmée'  },
  ANNULEE:    { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'Annulée'    },
};

const ReservationsAdminPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtre, setFiltre]             = useState('TOUTES');

  const fetchAll = async () => {
    try { const res = await reservationService.getAll(); setReservations(res.data); }
    catch { alert('Erreur chargement réservations'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleStatut = async (id, statut) => {
    try { await reservationService.updateStatut(id, statut); fetchAll(); }
    catch (e) { alert(e.response?.data?.message || 'Erreur'); }
  };

  const filters = ['TOUTES', 'EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'];
  const filtered = filtre === 'TOUTES' ? reservations : reservations.filter(r => r.statut === filtre);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 opacity-0 animate-fade-up">
        <p className="text-gold text-sm uppercase tracking-widest mb-1">Suivi</p>
        <h1 className="font-display text-4xl font-bold text-white">Réservations</h1>
      </div>

      {/* Filtres avec compteurs */}
      <div className="flex gap-2 mb-6 flex-wrap opacity-0 animate-fade-up delay-100">
        {filters.map(f => {
          const count = f === 'TOUTES' ? reservations.length : reservations.filter(r => r.statut === f).length;
          const s = statusConfig[f];
          return (
            <button key={f} onClick={() => setFiltre(f)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200"
              style={{
                background: filtre === f ? (s?.bg || 'rgba(245,158,11,0.15)') : 'rgba(255,255,255,0.03)',
                border: filtre === f ? `1px solid ${s?.color || '#F59E0B'}40` : '1px solid rgba(255,255,255,0.06)',
                color: filtre === f ? (s?.color || '#F59E0B') : 'rgba(255,255,255,0.35)',
              }}>
              {f === 'TOUTES' ? 'Toutes' : s?.label}
              <span className="px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r, i) => {
          const s = statusConfig[r.statut];
          return (
            <div key={r.id} className="p-6 rounded-2xl opacity-0 animate-fade-up transition-all duration-200 hover:scale-[1.01]"
              style={{ animationDelay: `${i * 0.05}s`, background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}>

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display font-bold text-white">Chambre {r.roomNumero}</h3>
                  <p className="text-white/40 text-xs mt-0.5">{r.roomType}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: s.bg, color: s.color }}>
                  {s.label}
                </span>
              </div>

              {/* Client */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-navy flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  {r.userNom?.[0] || '?'}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{r.userNom} {r.userPrenom}</p>
                </div>
              </div>

              {/* Infos */}
              <div className="space-y-1.5 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-white/30">Arrivée</span>
                  <span className="text-white">{r.dateDebut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Départ</span>
                  <span className="text-white">{r.dateFin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Durée</span>
                  <span className="text-white">{r.nombreNuits} nuit(s)</span>
                </div>
                <div className="flex justify-between pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-white/30">Total</span>
                  <span className="font-bold" style={{ color: '#F59E0B' }}>{r.prixTotal?.toLocaleString()} MAD</span>
                </div>
              </div>

              {/* Actions */}
              {r.statut === 'EN_ATTENTE' && (
                <div className="flex gap-2">
                  <button onClick={() => handleStatut(r.id, 'CONFIRMEE')}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                    ✓ Confirmer
                  </button>
                  <button onClick={() => handleStatut(r.id, 'ANNULEE')}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                    ✕ Annuler
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-white/30">Aucune réservation dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};

export default ReservationsAdminPage;