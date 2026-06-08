import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `nav-link fw-semibold mx-2 ${location.pathname === path ? "text-dark border-bottom border-dark border-2" : "text-muted"}`;

  return (
    <nav className="navbar navbar-expand-lg glass-navbar sticky-top py-3">
      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center text-dark tracking-tight"
          to="/"
        >
          {/* LOGO SVG SANDIKU PREMIUM */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="me-3 shadow-sm rounded-4"
          >
            {/* Latar Belakang Kotak Navy */}
            <rect width="100" height="100" rx="26" fill="#0f172a" />

            {/* Bentuk Tameng Gradien Biru */}
            <path
              d="M50 22 L76 34 V55 C76 74 50 85 50 85 C50 85 24 74 24 55 V34 L50 22Z"
              fill="url(#gradLogo)"
            />

            {/* Garis Centang (Checkmark) Modern */}
            <path
              d="M38 52 L46 60 L64 42"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Definisi Warna Gradien */}
            <defs>
              <linearGradient
                id="gradLogo"
                x1="24"
                y1="22"
                x2="76"
                y2="85"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>
          {/* END LOGO SVG */}
          SANDIKU
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className={navLinkClass("/")} to="/">
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navLinkClass("/analyzer")} to="/analyzer">
                Analisis
              </Link>
            </li>

            {token ? (
              <>
                <li className="nav-item ms-md-4">
                  <Link
                    className="btn btn-outline-ultra px-4 btn-sm py-2 rounded-pill"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button
                    onClick={handleLogout}
                    className="btn text-danger fw-semibold btn-sm py-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-md-4">
                <Link
                  className="btn btn-ultra px-4 btn-sm py-2 rounded-pill"
                  to="/login"
                >
                  Portal Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
