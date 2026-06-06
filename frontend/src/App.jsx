import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Fungsi pelindung rute agar Dashboard tidak bisa ditembus sembarang orang tanpa token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/login" element={<Login />} />

        {/* Melindungi halaman Dashboard menggunakan elemen rute terproteksi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback ke beranda jika mengetik url ngawur */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
