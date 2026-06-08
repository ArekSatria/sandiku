import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        SANDIKU
      </Link>

      <nav>
        <NavLink to="/">Beranda</NavLink>
        <NavLink to="/analyzer">Analisis</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
    </header>
  );
}
