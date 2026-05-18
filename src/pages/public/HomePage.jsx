import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const stats = [
  { value: '500+', label: 'Chambres gérées' },
  { value: '98%',  label: 'Satisfaction client' },
  { value: '24/7', label: 'Disponibilité' },
  { value: '50+',  label: 'Hôtels partenaires' },
];

const features = [
  { icon: '🛏', title: 'Chambres',      desc: 'Suivi temps réel du statut de chaque chambre avec gestion multi-étages.' },
  { icon: '📋', title: 'Réservations',  desc: 'Création, confirmation et annulation en quelques secondes.' },
  { icon: '📊', title: 'Analytics',     desc: 'Taux d\'occupation, revenus et tendances en un coup d\'œil.' },
  { icon: '👥', title: 'Multi-rôles',   desc: 'Admin, réceptionniste et client — chacun son espace dédié.' },
];

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'RECEPTIONNISTE') navigate('/admin/dashboard');
      else navigate('/client/dashboard');
    }
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-navy overflow-x-hidden">

      {/* Background décor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 glass border-b border-white/5' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse-gold"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              <span className="text-navy font-bold text-sm">E</span>
            </div>
            <span className="font-display font-bold text-xl text-white">EasyHotel</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm text-white/70 hover:text-white transition-colors duration-200">
              Se connecter
            </button>
            <button onClick={() => navigate('/register')}
              className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A' }}>
              Commencer →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass opacity-0 animate-fade-up"
            style={{ border: '1px solid rgba(245,158,11,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-sm font-medium">Système hôtelier nouvelle génération</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-black text-white leading-none mb-6 opacity-0 animate-fade-up delay-100">
            Gérez votre<br />
            <span className="text-shimmer">hôtel</span> avec<br />
            élégance.
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-up delay-200">
            Une plateforme complète pour piloter vos chambres, réservations et équipes —
            avec la précision d'un chef de réception et la puissance d'un système moderne.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-up delay-300">
            <button onClick={() => navigate('/register')}
              className="group px-8 py-4 rounded-xl font-semibold text-navy transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 8px 32px rgba(245,158,11,0.3)' }}>
              Créer mon espace
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
            <button onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 glass"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              Se connecter
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up delay-500">
          <span className="text-white/30 text-xs">Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center p-6 rounded-2xl glass opacity-0 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s`, border: '1px solid rgba(245,158,11,0.1)' }}>
              <p className="font-display text-4xl font-black text-gold mb-1">{s.value}</p>
              <p className="text-white/40 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-medium mb-3 tracking-widest uppercase">Fonctionnalités</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Tout ce qu'il vous faut,<br />
              <span className="text-white/40">rien de superflu.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={f.title}
                className={`group p-7 rounded-2xl glass transition-all duration-300 hover:scale-[1.02] cursor-default opacity-0 animate-fade-up`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Prêt à transformer<br />votre gestion hôtelière ?
            </h2>
            <p className="text-white/40 mb-8">Rejoignez des centaines d'hôteliers qui font confiance à EasyHotel.</p>
            <button onClick={() => navigate('/register')}
              className="px-10 py-4 rounded-xl font-semibold text-navy transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
              Démarrer maintenant — c'est gratuit
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-white/20 text-sm">
        © 2026 EasyHotel · Système de gestion hôtelière professionnel
      </footer>
    </div>
  );
};

export default HomePage;