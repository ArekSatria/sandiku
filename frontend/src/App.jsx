import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Placeholder halaman sementara (Nanti akan kita buat file aslinya di folder pages)
const Home = () => (
  <div className="container mt-5">
    <h1>Halaman Beranda</h1>
    <p>Selamat datang di SANDIKU.</p>
  </div>
);
const Analyzer = () => (
  <div className="container mt-5">
    <h1>Halaman Analisis Kata Sandi</h1>
  </div>
);
const Login = () => (
  <div className="container mt-5">
    <h1>Halaman Login Admin</h1>
  </div>
);
const Dashboard = () => (
  <div className="container mt-5">
    <h1>Dashboard Statistik Admin</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
