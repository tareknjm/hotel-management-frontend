const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Hôtel Management
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        Système de gestion des réservations
      </p>
      <div className="flex gap-4">
        <a href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Se connecter
        </a>
        <a href="/register"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
          S'inscrire
        </a>
      </div>
    </div>
  );
};

export default HomePage;