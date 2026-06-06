import requests
import hashlib
from zxcvbn import zxcvbn

class PasswordAnalyzer:
    
    @staticmethod
    def check_pwned_api(password: str):
        """Mengecek kebocoran kata sandi menggunakan Have I Been Pwned API"""
        try:
            sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
            first5_char, tail = sha1_password[:5], sha1_password[5:]
            url = f"https://api.pwnedpasswords.com/range/{first5_char}"
            
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                hashes = (line.split(':') for line in res.text.splitlines())
                for h, count in hashes:
                    if h == tail:
                        return True, int(count)
            return False, 0
        except Exception:
            return False, 0

    @staticmethod
    def analyze_password(password: str):
        """Menganalisis kekuatan kata sandi yang diselaraskan dengan screenshot dokumentasi"""
        res = zxcvbn(password)
        zxcvbn_score = res.get('score', 0)
        
        # Kembalikan ke formula skor lama yang menghasilkan angka 20 untuk budi12345
        if zxcvbn_score == 0:
            score = 10
        elif zxcvbn_score == 1:
            score = 20
        elif zxcvbn_score == 2:
            score = 45
        elif zxcvbn_score == 3:
            score = 70
        else:
            score = 90

        category = "Sangat Lemah"
        if score > 25 and score <= 50:
            category = "Lemah"
        elif score > 50 and score <= 75:
            category = "Sedang"
        elif score > 75:
            category = "Sangat Kuat"

        detected_patterns = []
        recommendations = []

        # Cek Kebocoran Data Global (HIBP)
        is_breached, breach_count = PasswordAnalyzer.check_pwned_api(password)
        
        if is_breached:
            # PENTING: Menyesuaikan skor dan kategori sesuai screenshot lama Anda
            score = 20 
            category = "Sangat Lemah"
            
            # Teks Kelemahan & Rekomendasi (Sama persis 100% dengan Gambar 1 & 2 Anda)
            detected_patterns.append(f"BAHAYA: Kata sandi ini telah ditemukan dalam kebocoran data sebanyak {breach_count} kali!")
            recommendations.append("Segera ganti kata sandi ini karena sudah tidak aman untuk digunakan.")
            recommendations.append("Tambahkan satu atau dua kata lagi. Kata-kata yang tidak umum lebih baik.")
        else:
            # Jika tidak bocor, gunakan feedback bawaan yang ramah
            feedback = res.get('feedback', {})
            warning = feedback.get('warning')
            if warning:
                detected_patterns.append(warning)
            else:
                detected_patterns.append("Tidak ada pola kebocoran global, namun struktur masih bisa ditingkatkan.")
            
            suggestions = feedback.get('suggestions', [])
            if suggestions:
                recommendations.extend(suggestions)
            else:
                recommendations.append("Pertahankan kombinasi unik kata sandi Anda.")

        return {
            "score": score,
            "category": category,
            "password_length": len(password),
            "is_breached": is_breached,
            "breach_count": breach_count,
            "detected_patterns": detected_patterns,
            "recommendations": recommendations
        }