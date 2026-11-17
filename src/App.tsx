import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<div className="page"><h1>Mis reservas</h1><p className="muted">Próximamente...</p></div>} />
          </Route>

          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        Fly Away Travel · CS2031 · Celeste Sevillano
      </footer>
    </div>
  );
}
