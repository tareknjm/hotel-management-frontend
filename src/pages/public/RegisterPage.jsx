import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm]     = useState({ nom: '', prenom: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/client/dashboard');
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Inscription</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {['nom','prenom','email','password'].map(field => (
          <input
            key={field}
            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;