import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Routes ajoutées à chaque étape */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;