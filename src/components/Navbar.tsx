import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <Link to="/search" className="brand">
        <span className="brand-mark" aria-hidden="true">
          &#9992;
        </span>
        Fly Away Travel
      </Link>

      <nav className="nav-links">
        <NavLink to="/search">Buscar vuelos</NavLink>
        {isAuthenticated && <NavLink to="/bookings">Mis reservas</NavLink>}
        {!isAuthenticated && <NavLink to="/login">Iniciar sesion</NavLink>}
        {!isAuthenticated && <NavLink to="/register">Registrarse</NavLink>}
      </nav>

      {isAuthenticated && (
        <div className="nav-user">
          <span className="user-chip">
            {user ? `${user.firstName} ${user.lastName}` : 'Sesion activa'}
          </span>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      )}
    </header>
  );
}
