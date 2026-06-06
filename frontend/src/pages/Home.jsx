import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5 animate-slide-up">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="col-md-9 text-center">
          <h1 className="display-3 fw-bold mb-4 text-gradient">
            Analisis Keamanan Kata Sandi Anda
          </h1>
          <p className="lead text-secondary mb-5 px-md-5">
            Sistem cerdas berbasis <i>hybrid</i> untuk mendeteksi kelemahan,
            pola berulang, dan mengecek status kebocoran kredensial Anda di
            internet secara aman dan anonim.
          </p>
          <Link
            to="/analyzer"
            className="btn btn-cyber btn-lg px-5 py-3 rounded-pill fw-bold"
          >
            Mulai Analisis Sekarang <i className="bi bi-arrow-right ms-2"></i>
          </Link>

          <div className="mt-5 pt-5 row text-start">
            <div className="col-md-4 mb-4">
              <div className="card-premium p-4 h-100">
                <h5 className="fw-bold text-dark">🔒 100% Anonim</h5>
                <p className="text-muted small mb-0">
                  Kata sandi Anda diproses secara lokal dan tidak pernah
                  disimpan ke dalam basis data.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card-premium p-4 h-100">
                <h5 className="fw-bold text-dark">📊 Standar Global</h5>
                <p className="text-muted small mb-0">
                  Menggunakan algoritma komputasi yang diadopsi dari standar
                  keamanan industri.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card-premium p-4 h-100">
                <h5 className="fw-bold text-dark">🚨 Cek Kebocoran</h5>
                <p className="text-muted small mb-0">
                  Terintegrasi dengan miliaran data kebocoran untuk memastikan
                  kredensial Anda belum terkompromi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
