import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5 fade-in-up">
      <div
        className="row justify-content-center align-items-center text-center"
        style={{ minHeight: "65vh", paddingTop: "5vh" }}
      >
        <div className="col-md-8">
          {/* Teks Badge Diperbaiki */}
          <span className="ultra-badge bg-light text-secondary border border-secondary-subtle mb-4 d-inline-block">
            Sistem Analisis Kata Sandi
          </span>

          <h1
            className="display-4 fw-bolder mb-4 text-dark"
            style={{ letterSpacing: "-1px", lineHeight: "1.2" }}
          >
            Keamanan Kredensial,
            <br />
            Didefinisikan Ulang.
          </h1>

          {/* Deskripsi Dipertegas */}
          <p
            className="lead text-muted mb-5 px-md-5"
            style={{ fontSize: "1.15rem" }}
          >
            Lakukan audit pada struktur kata sandi Anda menggunakan algoritma
            komputasi modern. Identifikasi kerentanan sandi Anda dan pastikan
            aman dari ancaman kebocoran global.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/analyzer" className="btn btn-ultra px-5 py-3 fs-6">
              Mulai Analisis Sekarang
            </Link>
          </div>
        </div>
      </div>

      <div
        className="row mt-5 pt-5 g-4 text-start fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {/* Kartu 1 */}
        <div className="col-md-4">
          <div className="ultra-card p-5 h-100">
            {/* Latar belakang ikon diubah jadi gelap agar kontras dan elegan */}
            <div
              className="text-white bg-dark rounded-circle d-inline-flex justify-content-center align-items-center mb-4 shadow-sm"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="bi bi-incognito fs-4"></i>
            </div>
            <h5 className="fw-bold text-dark">Privasi Terjamin</h5>
            <p className="text-muted small mb-0">
              Pemrosesan dilakukan secara terisolasi. Kata sandi asli Anda tidak
              pernah direkam atau disimpan di basis data kami.
            </p>
          </div>
        </div>

        {/* Kartu 2 */}
        <div className="col-md-4">
          <div className="ultra-card p-5 h-100">
            <div
              className="text-white bg-dark rounded-circle d-inline-flex justify-content-center align-items-center mb-4 shadow-sm"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="bi bi-cpu fs-4"></i>
            </div>
            <h5 className="fw-bold text-dark">Algoritma Hybrid</h5>
            <p className="text-muted small mb-0">
              Mengkombinasikan heuristik Zxcvbn dengan analisis pola berulang
              untuk mendeteksi kelemahan secara akurat.
            </p>
          </div>
        </div>

        {/* Kartu 3 */}
        <div className="col-md-4">
          <div className="ultra-card p-5 h-100">
            <div
              className="text-white bg-dark rounded-circle d-inline-flex justify-content-center align-items-center mb-4 shadow-sm"
              style={{ width: "50px", height: "50px" }}
            >
              <i className="bi bi-globe fs-4"></i>
            </div>
            <h5 className="fw-bold text-dark">Verifikasi Global</h5>
            <p className="text-muted small mb-0">
              Mengecek silang kredensial Anda terhadap miliaran data dari
              insiden kebocoran internet menggunakan API terenkripsi.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 pt-4 pb-5 text-muted small">
        &copy; 2026 UBD. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
