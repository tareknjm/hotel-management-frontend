import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goHome = () => {
    if (!user) navigate('/login');
    else if (user.role === 'ADMIN' || user.role === 'RECEPTIONNISTE')
      navigate('/admin/dashboard');
    else navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🚫</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Accès refusé</h1>
        <p className="text-gray-500 mb-8">
          Tu n'as pas les permissions pour accéder à cette page.
        </p>
        <button
          onClick={goHome}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Retour à mon espace
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;