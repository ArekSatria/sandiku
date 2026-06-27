import { Link, NavLink } from "react-router-dom";
import sandiscanLogo from "../assets/sandiscan-logo.png";

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <header className="top-nav">
        <Link to="/" className="brand-lockup" aria-label="SANDISCAN Beranda">
          <img src={sandiscanLogo} alt="SANDISCAN" className="brand-logo-img" />

          <div className="brand-text">
            <span className="brand-name">SANDISCAN</span>
            <span className="brand-subtitle">
              Sistem Analisis Kekuatan Kata Sandi
            </span>
          </div>
        </Link>

        <nav className="nav-links" aria-label="Navigasi utama">
          <NavLink to="/">Beranda</NavLink>
          <NavLink to="/analyzer">Analisis</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>
    </div>
  );
}