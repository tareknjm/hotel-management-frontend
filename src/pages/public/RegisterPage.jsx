import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const steps = [
  { fields: ['nom', 'prenom'],           title: 'Votre identité',   subtitle: 'Comment vous appelle-t-on ?' },
  { fields: ['email', 'password'],       title: 'Vos accès',        subtitle: 'Sécurisez votre compte.' },
];

const fieldConfig = {
  nom:      { label: 'Nom',          type: 'text',     placeholder: 'Dupont'           },
  prenom:   { label: 'Prénom',       type: 'text',     placeholder: 'Jean'             },
  email:    { label: 'Email',        type: 'email',    placeholder: 'jean@example.com' },
  password: { label: 'Mot de passe', type: 'password', placeholder: 'Min. 6 caractères' },
};

const RegisterPage = () => {
  const [form, setForm]       = useState({ nom: '', prenom: '', email: '', password: '' });
  const [step, setStep]       = useState(0);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const nextStep = () => {
    const current = steps[step].fields;
    if (current.some(f => !form[f])) { setError('Remplis tous les champs'); return; }
    setError('');
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Remplis tous les champs'); return; }
    if (form.password.length < 6) { setError('Mot de passe trop court (min. 6 caractères)'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/client/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy flex overflow-hidden">

      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16"
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 20px 60px rgba(245,158,11,0.4)' }}>
            <span className="text-navy font-display font-black text-3xl">E</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Rejoignez-nous.</h2>
          <p className="text-white/40 max-w-xs mx-auto leading-relaxed">
            Créez votre espace en 2 étapes et commencez à gérer votre établissement.
          </p>
          {/* Progress visual */}
          <div className="mt-16 flex flex-col gap-4 max-w-xs mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-4 text-left transition-all duration-300">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300"
                  style={{
                    background: i <= step ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255,255,255,0.05)',
                    color: i <= step ? '#0F172A' : 'rgba(255,255,255,0.3)',
                    border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: i <= step ? 'white' : 'rgba(255,255,255,0.3)' }}>{s.title}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{s.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8 text-sm">
              ← Retour
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white/20 text-sm">Étape {step + 1} / 2</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="flex gap-1">
                {[0, 1].map(i => (
                  <div key={i} className="h-1 rounded-full transition-all duration-300"
                    style={{ width: i <= step ? '24px' : '8px', background: i <= step ? '#F59E0B' : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">{steps[step].title}</h1>
            <p className="text-white/40">{steps[step].subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="text-red-400">⚠</span>
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-5 animate-fade-up">
            {steps[step].fields.map(f => {
              const cfg = fieldConfig[f];
              return (
                <div key={f}>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-200"
                    style={{ color: focused === f ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>
                    {cfg.label}
                  </label>
                  <input
                    type={cfg.type}
                    placeholder={cfg.placeholder}
                    value={form[f]}
                    onChange={e => setForm({ ...form, [f]: e.target.value })}
                    onFocus={() => setFocused(f)}
                    onBlur={() => setFocused('')}
                    onKeyDown={e => e.key === 'Enter' && (step === 0 ? nextStep() : handleSubmit())}
                    className="w-full px-5 py-4 rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: focused === f ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: focused === f ? '0 0 0 3px rgba(245,158,11,0.1)' : 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-8">
            {step === 1 && (
              <button onClick={() => { setStep(0); setError(''); }}
                className="px-6 py-4 rounded-xl font-medium text-white/50 hover:text-white transition-colors glass"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                ← Retour
              </button>
            )}
            <button
              onClick={step === 0 ? nextStep : handleSubmit}
              disabled={loading}
              className="flex-1 py-4 rounded-xl font-semibold text-navy transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 8px 32px rgba(245,158,11,0.25)' }}>
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>Inscription...</>
              ) : step === 0 ? 'Continuer →' : 'Créer mon compte →'}
            </button>
          </div>

          <p className="text-center text-white/30 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;