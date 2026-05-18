import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Remplis tous les champs'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      if (res.data.role === 'ADMIN' || res.data.role === 'RECEPTIONNISTE') navigate('/admin/dashboard');
      else navigate('/client/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy flex overflow-hidden">

      {/* Left — décoratif */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16"
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full animate-spin-slow pointer-events-none"
          style={{ border: '1px solid rgba(245,158,11,0.1)' }} />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full animate-spin-slow pointer-events-none"
          style={{ border: '1px solid rgba(245,158,11,0.15)', animationDirection: 'reverse', animationDuration: '12s' }} />
        <div className="relative z-10 text-center animate-float">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 20px 60px rgba(245,158,11,0.4)' }}>
            <span className="text-navy font-display font-black text-3xl">E</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">EasyHotel</h2>
          <p className="text-white/40 text-lg max-w-xs mx-auto leading-relaxed">
            La plateforme de gestion hôtelière pensée pour l'excellence.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[['🛏','Chambres'],['📋','Réservations'],['📊','Analytics'],['👥','Équipes']].map(([icon, label]) => (
              <div key={label} className="p-4 rounded-xl glass text-center"
                style={{ border: '1px solid rgba(245,158,11,0.1)' }}>
                <span className="text-xl">{icon}</span>
                <p className="text-white/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md opacity-0 animate-fade-up">

          {/* Header */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 text-sm">
              ← Retour
            </Link>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Bon retour.</h1>
            <p className="text-white/40">Connecte-toi à ton espace EasyHotel.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="text-red-400 text-lg">⚠</span>
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Champs */}
          <div className="space-y-5">
            {[
              { key: 'email',    label: 'Email',          type: 'email',    placeholder: 'vous@example.com' },
              { key: 'password', label: 'Mot de passe',   type: 'password', placeholder: '••••••••'         },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-2 transition-colors duration-200"
                  style={{ color: focused === f.key ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  onFocus={() => setFocused(f.key)}
                  onBlur={() => setFocused('')}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-5 py-4 rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: focused === f.key ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: focused === f.key ? '0 0 0 3px rgba(245,158,11,0.1)' : 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Bouton */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-8 py-4 rounded-xl font-semibold text-navy transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 8px 32px rgba(245,158,11,0.25)' }}>
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Connexion...
              </>
            ) : 'Se connecter →'}
          </button>

          <p className="text-center text-white/30 text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-gold hover:text-gold-light transition-colors font-medium">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;