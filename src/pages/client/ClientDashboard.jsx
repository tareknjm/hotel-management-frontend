import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';

const statusConfig = {
  EN_ATTENTE:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'En attente'  },
  CONFIRMEE:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Confirmée'   },
  ANNULEE:     { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'Annulée'     },
};

const ClientDashboard = () => {
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();
  const [rooms, setRooms]               = useState([]);
  const [reservations, setReservations] = useState([]);
  const [view, setView]                 = useState('rooms');
  const [form, setForm]                 = useState({ roomId: '', dateDebut: '', dateFin: '' });
  const [msg, setMsg]                   = useState({ type: '', text: '' });
  const [loading, setLoading]           = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    roomService.getDisponibles().then(r => setRooms(r.data)).catch(() => {});
    reservationService.getMesReservations().then(r => setReservations(r.data)).catch(() => {});
  }, []);

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setForm(f => ({ ...f, roomId: String(room.id) }));
  };

  const nights = form.dateDebut && form.dateFin
    ? Math.max(0, Math.ceil((new Date(form.dateFin) - new Date(form.dateDebut)) / 86400000))
    : 0;

  const handleReserver = async () => {
    if (!form.roomId || !form.dateDebut || !form.dateFin) { setMsg({ type: 'error', text: 'Remplis tous les champs' }); return; }
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      await reservationService.create({ roomId: parseInt(form.roomId), dateDebut: form.dateDebut, dateFin: form.dateFin });
      setMsg({ type: 'success', text: '✓ Réservation créée avec succès !' });
      setForm({ roomId: '', dateDebut: '', dateFin: '' }); setSelectedRoom(null);
      const res = await reservationService.getMesReservations();
      setReservations(res.data);
    } catch (e) { setMsg({ type: 'error', text: e.response?.data?.message || 'Erreur' }); }
    finally { setLoading(false); }
  };

  const handleAnnuler = async (id) => {
    if (!confirm('Annuler cette réservation ?')) return;
    try {
      await reservationService.annuler(id);
      const res = await reservationService.getMesReservations();
      setReservations(res.data);
    } catch (e) { alert(e.response?.data?.message || 'Erreur'); }
  };

  const navItems = [
    { key: 'rooms',        icon: '🛏', label: 'Réserver',         count: null },
    { key: 'reservations', icon: '📋', label: 'Mes réservations', count: reservations.length },
  ];

  return (
    <div className="flex min-h-screen bg-navy">
      {/* Sidebar client */}
      <aside className="w-64 flex flex-col" style={{ background: '#1E293B', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              <span className="text-navy font-bold text-sm">E</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">EasyHotel</p>
              <p className="text-white/30 text-xs">Espace client</p>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-navy text-sm"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              {user?.nom?.[0] || 'C'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.nom}</p>
              <p className="text-gold text-xs">Client</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 mt-2 space-y-1">
          {navItems.map(({ key, icon, label, count }) => (
            <button key={key} onClick={() => setView(key)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left"
              style={{
                background: view === key ? 'rgba(245,158,11,0.1)' : 'transparent',
                border: view === key ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
              }}>
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium flex-1" style={{ color: view === key ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>{label}</span>
              {count !== null && (
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: view === key ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: view === key ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200">
            <span className="text-lg">⎋</span>
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        {view === 'rooms' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 opacity-0 animate-fade-up">
              <p className="text-gold text-sm uppercase tracking-widest mb-1">Nouvelle réservation</p>
              <h1 className="font-display text-3xl font-bold text-white">Choisissez votre chambre</h1>
            </div>

            {/* Formulaire dates */}
            <div className="p-6 rounded-2xl mb-8 opacity-0 animate-fade-up delay-100"
              style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white/50 text-sm mb-4 font-medium">Sélectionnez vos dates</p>

              {msg.text && (
                <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in"
                  style={{
                    background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    color: msg.type === 'success' ? '#10B981' : '#EF4444',
                  }}>
                  {msg.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider">Arrivée</label>
                  <input type="date" value={form.dateDebut} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, dateDebut: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider">Départ</label>
                  <input type="date" value={form.dateFin} min={form.dateDebut || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, dateFin: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-2 uppercase tracking-wider">Résumé</label>
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    {selectedRoom && nights > 0 ? (
                      <div>
                        <p className="text-white/60 text-xs">Chambre {selectedRoom.numero} · {nights} nuit(s)</p>
                        <p className="text-gold font-bold">{(nights * selectedRoom.prixParNuit).toLocaleString()} MAD</p>
                      </div>
                    ) : (
                      <p className="text-white/20">Sélectionnez chambre + dates</p>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={handleReserver} disabled={loading}
                className="mt-4 w-full py-3 rounded-xl font-semibold text-navy transition-all duration-300 hover:scale-[1.01] disabled:opacity-30 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                {loading ? 'En cours...' : '✓ Confirmer la réservation'}
              </button>
            </div>

            {/* Grille chambres */}
            <p className="text-white/20 text-xs uppercase tracking-widest mb-4">
              {rooms.length} chambre(s) disponible(s)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room, i) => {
                const isSelected = form.roomId == room.id;
                return (
                  <div key={room.id} onClick={() => selectRoom(room)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] opacity-0 animate-fade-up`}
                    style={{
                      animationDelay: `${i * 0.06}s`,
                      background: isSelected ? 'rgba(245,158,11,0.08)' : '#1E293B',
                      border: isSelected ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.04)',
                      boxShadow: isSelected ? '0 0 0 1px rgba(245,158,11,0.2)' : 'none',
                    }}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: isSelected ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        🛏
                      </div>
                      {isSelected && <span className="text-gold text-xs font-medium">✓ Sélectionnée</span>}
                    </div>
                    <h3 className="font-display font-bold text-white mb-1">Chambre {room.numero}</h3>
                    <p className="text-white/40 text-sm mb-3">{room.type} · Étage {room.etage}</p>
                    <p className="font-bold" style={{ color: '#F59E0B' }}>
                      {room.prixParNuit.toLocaleString()} <span className="text-white/30 font-normal text-xs">MAD/nuit</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'reservations' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 opacity-0 animate-fade-up">
              <p className="text-gold text-sm uppercase tracking-widest mb-1">Historique</p>
              <h1 className="font-display text-3xl font-bold text-white">Mes Réservations</h1>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-24 opacity-0 animate-fade-up delay-100">
                <p className="text-5xl mb-4">🛏</p>
                <p className="text-white/30">Aucune réservation pour l'instant.</p>
                <button onClick={() => setView('rooms')} className="mt-4 px-6 py-2 rounded-xl text-sm font-medium text-navy"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                  Faire une réservation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((r, i) => {
                  const s = statusConfig[r.statut];
                  return (
                    <div key={r.id} className="p-6 rounded-2xl opacity-0 animate-fade-up"
                      style={{ animationDelay: `${i * 0.08}s`, background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-display font-bold text-white">Chambre {r.roomNumero}</h3>
                          <p className="text-white/40 text-sm">{r.roomType}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-white/40 mb-4">
                        <p>📅 {r.dateDebut} → {r.dateFin}</p>
                        <p>🌙 {r.nombreNuits} nuit(s)</p>
                        <p className="text-gold font-medium">💰 {r.prixTotal.toLocaleString()} MAD</p>
                      </div>
                      {r.statut === 'EN_ATTENTE' && (
                        <button onClick={() => handleAnnuler(r.id)}
                          className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-80"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                          Annuler la réservation
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;