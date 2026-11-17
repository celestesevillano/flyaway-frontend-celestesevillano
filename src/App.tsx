import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        Fly Away Travel · CS2031 · Celeste Sevillano
      </footer>
    </div>
  );
}
