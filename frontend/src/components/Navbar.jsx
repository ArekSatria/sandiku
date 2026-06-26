import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <header className="top-nav">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark">
            <i className="bi bi-shield-check"></i>
          </span>
          <div>
            <strong>SANDISCAN</strong>
            <small>Sistem Analisis Kata Sandi</small>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Beranda</NavLink>
          <NavLink to="/analyzer">Analisis</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>
    </div>
  );
}
