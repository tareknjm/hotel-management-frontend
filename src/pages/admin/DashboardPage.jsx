import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const StatCard = ({ icon, label, value, sub, color, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, []);

  return (
    <div className={`relative p-6 rounded-2xl overflow-hidden transition-all duration-500 cursor-default group hover:scale-[1.02] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)', transitionDelay: `${delay}ms` }}>
      {/* Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          {icon}
        </div>
        {sub !== undefined && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>
            {sub}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-white/40 text-sm">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const occupancy = stats ? Math.round((stats.chambresOccupees / stats.totalChambres) * 100) || 0 : 0;

  useEffect(() => {
    adminService.getStats()
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl mx-auto mb-4 animate-pulse"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }} />
        <p className="text-white/30 text-sm">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 opacity-0 animate-fade-up">
        <div>
          <p className="text-gold text-sm font-medium mb-1 tracking-widest uppercase">Vue d'ensemble</p>
          <h1 className="font-display text-4xl font-bold text-white">Tableau de bord</h1>
        </div>
        <div className="px-4 py-2 rounded-xl text-sm text-white/40 glass"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Cards chambres */}
      <p className="text-white/20 text-xs uppercase tracking-widest mb-4">Chambres</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🏨" label="Total chambres"  value={stats.totalChambres}       color="#F59E0B" delay={0}   />
        <StatCard icon="✅" label="Disponibles"     value={stats.chambresDisponibles} color="#10B981" delay={100} sub="Libres" />
        <StatCard icon="🔴" label="Occupées"        value={stats.chambresOccupees}    color="#EF4444" delay={200} />
      </div>

      {/* Cards réservations */}
      <p className="text-white/20 text-xs uppercase tracking-widest mb-4">Réservations</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="📋" label="Total"       value={stats.totalReservations}      color="#8B5CF6" delay={300} />
        <StatCard icon="⏳" label="En attente"  value={stats.reservationsEnAttente}  color="#F59E0B" delay={400} />
        <StatCard icon="✓"  label="Confirmées"  value={stats.reservationsConfirmees} color="#10B981" delay={500} />
      </div>

      {/* Revenu + clients */}
      <p className="text-white/20 text-xs uppercase tracking-widest mb-4">Finances & Clients</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard icon="💰" label="Revenu total"   value={`${stats.revenuTotal.toLocaleString()} MAD`} color="#10B981" delay={600} />
        <StatCard icon="👥" label="Total clients"  value={stats.totalClients}                           color="#3B82F6" delay={700} />
      </div>

      {/* Occupation bar */}
      <div className="p-6 rounded-2xl opacity-0 animate-fade-up delay-400"
        style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.04)', animationDelay: '0.8s' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-white font-medium">Taux d'occupation</p>
            <p className="text-white/30 text-sm">Chambres occupées / total</p>
          </div>
          <p className="font-display text-3xl font-black text-gold">{occupancy}%</p>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${occupancy}%`,
              background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
              boxShadow: '0 0 12px rgba(245,158,11,0.4)',
            }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/20">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;