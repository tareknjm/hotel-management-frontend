import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);

      if (res.data.role === 'ADMIN')           navigate('/admin/dashboard');
      else if (res.data.role === 'RECEPTIONNISTE') navigate('/receptionniste/dashboard');
      else                                     navigate('/client/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Connexion</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Pas de compte ?{' '}
          <a href="/register" className="text-blue-600 hover:underline">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;