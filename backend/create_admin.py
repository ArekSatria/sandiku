from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.core.security import get_password_hash

# Pastikan tabel dibuat
Base.metadata.create_all(bind=engine)

def create_first_admin():
    db = SessionLocal()
    # Cek apakah sudah ada admin
    admin_exists = db.query(User).filter(User.email == "admin@sandiku.com").first()
    
    if not admin_exists:
        hashed_pw = get_password_hash("ArekSatria07!")
        new_admin = User(name="Bro Admin", email="admin@sandiku.com", password_hash=hashed_pw)
        db.add(new_admin)
        db.commit()
        print("✅ Akun Admin berhasil dibuat!")
        print("Email: admin@sandiku.com")
        print("Password: ArekSatria07!")
    else:
        print("⚠️ Akun Admin sudah ada di database.")
    
    db.close()

if __name__ == "__main__":
    create_first_admin()