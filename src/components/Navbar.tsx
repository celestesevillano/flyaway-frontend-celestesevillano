import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
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
      </nav>
    </header>
  );
}
