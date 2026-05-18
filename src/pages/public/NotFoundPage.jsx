import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-black text-blue-100 mb-2">404</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8">Cette page n'existe pas.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;