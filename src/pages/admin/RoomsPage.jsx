import { useEffect, useState } from 'react';
import { roomService } from '../../services/roomService';

const statusConfig = {
  DISPONIBLE:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Disponible'    },
  OCCUPEE:      { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'Occupée'       },
  EN_NETTOYAGE: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'En nettoyage'  },
  HORS_SERVICE: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', label: 'Hors service'  },
};

const typeIcons = { SIMPLE: '🛏', DOUBLE: '🛏🛏', SUITE: '👑', DELUXE: '⭐' };

const RoomModal = ({ room, onSave, onClose }) => {
  const [form, setForm] = useState({ numero: '', type: 'SIMPLE', etage: 1, prixParNuit: 0 });
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (room) setForm({ numero: room.numero, type: room.type, etage: room.etage, prixParNuit: room.prixParNuit });
  }, [room]);

  const fields = [
    { key: 'numero', label: 'Numéro', placeholder: 'ex: 101', type: 'text' },
    { key: 'etage', label: 'Étage', placeholder: '1', type: 'number' },
    { key: 'prixParNuit', label: 'Prix / nuit (MAD)', placeholder: '500', type: 'number' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-7 animate-fade-up"
        style={{ background: '#1E293B', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {room ? 'Modifier la chambre' : 'Nouvelle chambre'}
            </h2>
            <p className="text-white/30 text-sm mt-0.5">
              {room ? `Chambre ${room.numero}` : 'Remplissez les informations'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs uppercase tracking-wider mb-2 transition-colors duration-200"
                style={{ color: focused === f.key ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>
                {f.label}
              </label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                onFocus={() => setFocused(f.key)} onBlur={() => setFocused('')}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 text-sm"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: focused === f.key ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: focused === f.key ? '0 0 0 3px rgba(245,158,11,0.08)' : 'none',
                }} />
            </div>
          ))}

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2 text-white/40">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
              style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)' }}>
              {['SIMPLE', 'DOUBLE', 'SUITE', 'DELUXE'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-white/40 hover:text-white transition-colors text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            Annuler
          </button>
          <button onClick={() => onSave(form)}
            className="flex-1 py-3 rounded-xl font-semibold text-navy text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomsPage = () => {
  const [rooms, setRooms]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom]   = useState(null);
  const [filter, setFilter]       = useState('TOUTES');
  const [error, setError]         = useState('');

  const fetchRooms = async () => {
    try { const res = await roomService.getAll(); setRooms(res.data); }
    catch { setError('Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSave = async (form) => {
    try {
      if (editRoom) await roomService.update(editRoom.id, form);
      else await roomService.create(form);
      setShowModal(false); setEditRoom(null); fetchRooms();
    } catch (e) { alert(e.response?.data?.message || 'Erreur'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette chambre ?')) return;
    try { await roomService.delete(id); fetchRooms(); }
    catch (e) { alert(e.response?.data?.message || 'Erreur'); }
  };

  const handleStatut = async (id, statut) => {
    try { await roomService.updateStatut(id, statut); fetchRooms(); }
    catch { alert('Erreur mise à jour statut'); }
  };

  const filters = ['TOUTES', 'DISPONIBLE', 'OCCUPEE', 'EN_NETTOYAGE', 'HORS_SERVICE'];
  const filtered = filter === 'TOUTES' ? rooms : rooms.filter(r => r.statut === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 opacity-0 animate-fade-up">
        <div>
          <p className="text-gold text-sm uppercase tracking-widest mb-1">Inventaire</p>
          <h1 className="font-display text-4xl font-bold text-white">Chambres</h1>
        </div>
        <button onClick={() => { setEditRoom(null); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-navy text-sm transition-all duration-200 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}>
          + Nouvelle chambre
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap opacity-0 animate-fade-up delay-100">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200"
            style={{
              background: filter === f ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
              border: filter === f ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: filter === f ? '#F59E0B' : 'rgba(255,255,255,0.35)',
            }}>
            {f === 'TOUTES' ? `Toutes (${rooms.length})` : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room, i) => {
          const s = statusConfig[room.statut];
          return (
            <div key={room.id} className="group p-6 rounded-2xl opacity-0 animate-fade-up transition-all duration-200 hover:scale-[1.01]"
              style={{ animationDelay: `${i * 0.05}s`, background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
                  {typeIcons[room.type] || '🛏'}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: s.bg, color: s.color }}>
                  {s.label}
                </span>
              </div>

              <h3 className="font-display font-bold text-white text-lg mb-1">Chambre {room.numero}</h3>
              <p className="text-white/40 text-sm mb-3">{room.type} · Étage {room.etage}</p>
              <p className="font-bold mb-4" style={{ color: '#F59E0B' }}>
                {room.prixParNuit.toLocaleString()} <span className="text-white/30 font-normal text-xs">MAD/nuit</span>
              </p>

              {/* Statut select */}
              <select value={room.statut} onChange={e => handleStatut(room.id, e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs outline-none mb-3 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="OCCUPEE">Occupée</option>
                <option value="EN_NETTOYAGE">En nettoyage</option>
                <option value="HORS_SERVICE">Hors service</option>
              </select>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => { setEditRoom(room); setShowModal(true); }}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-80"
                  style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.15)' }}>
                  Modifier
                </button>
                <button onClick={() => handleDelete(room.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-80"
                  style={{ background: 'rgba(239,68,68,0.06)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.12)' }}>
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !error && (
        <div className="text-center py-24">
          <p className="text-4xl mb-3">🛏</p>
          <p className="text-white/30">Aucune chambre dans cette catégorie.</p>
        </div>
      )}

      {showModal && <RoomModal room={editRoom} onSave={handleSave} onClose={() => { setShowModal(false); setEditRoom(null); }} />}
    </div>
  );
};

export default RoomsPage;