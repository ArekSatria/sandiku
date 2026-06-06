import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 fw-bold mb-4">Selamat Datang di SANDIKU</h1>
          <p className="lead text-muted mb-5">
            Sistem Analisis Kekuatan Kata Sandi berbasis hybrid. Lindungi akun
            digital Anda dengan memastikan kata sandi yang Anda gunakan tidak
            mudah ditebak dan belum pernah bocor di internet.
          </p>
          <Link
            to="/analyzer"
            className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow"
          >
            Mulai Analisis Kata Sandi
          </Link>

          <div className="mt-5 row text-start">
            <div className="col-md-4">
              <h5 className="fw-bold">🔒 Aman & Anonim</h5>
              <p className="text-muted small">
                Kata sandi asli Anda tidak pernah disimpan di dalam database
                kami.
              </p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">📊 Analisis Akurat</h5>
              <p className="text-muted small">
                Mendeteksi pola lemah, kata sandi umum, dan pengulangan
                karakter.
              </p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">🚨 Cek Kebocoran</h5>
              <p className="text-muted small">
                Terintegrasi dengan database kebocoran global untuk mengecek
                status kata sandi Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
