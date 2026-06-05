from zxcvbn import zxcvbn
from app.services.rule_checker import RuleChecker
from app.services.hibp_checker import HibpChecker

# Kamus Terjemahan Zxcvbn (Inggris -> Indonesia)
TRANSLATIONS = {
    "warnings": {
        "Use a few words, avoid common phrases": "Gunakan beberapa kata, hindari frasa umum.",
        "No need for symbols, digits, or uppercase letters": "Tidak perlu simbol, angka, atau huruf kapital.",
        "This is a very common password": "Kata sandi ini sangat umum digunakan.",
        "This is a very common password.": "Kata sandi ini sangat umum digunakan.",
        "This is similar to a commonly used password": "Ini mirip dengan kata sandi yang umum digunakan.",
        "A word by itself is easy to guess": "Satu kata saja mudah ditebak.",
        "Names and surnames by themselves are easy to guess": "Nama dan nama keluarga saja mudah ditebak.",
        "Common names and surnames are easy to guess": "Nama dan nama keluarga yang umum mudah ditebak.",
        "Straight rows of keys are easy to guess": "Urutan tombol keyboard yang lurus mudah ditebak.",
        "Short keyboard patterns are easy to guess": "Pola keyboard pendek mudah ditebak.",
        "Repeats like \"aaa\" are easy to guess": "Pengulangan seperti 'aaa' mudah ditebak.",
        "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"": "Pengulangan seperti 'abcabcabc' hanya sedikit lebih sulit ditebak daripada 'abc'.",
        "Dates are often easy to guess": "Tanggal sering kali mudah ditebak.",
        "Recent years are easy to guess": "Tahun-tahun belakangan ini mudah ditebak."
    },
    "suggestions": {
        "Add another word or two. Uncommon words are better.": "Tambahkan satu atau dua kata lagi. Kata-kata yang tidak umum lebih baik.",
        "Capitalization doesn't help very much": "Huruf kapital tidak terlalu membantu.",
        "All-uppercase is almost as easy to guess as all-lowercase": "Semua huruf kapital hampir sama mudahnya ditebak dengan semua huruf kecil.",
        "Reversed words aren't much harder to guess": "Kata yang dibalik tidak jauh lebih sulit ditebak.",
        "Predictable substitutions like '@' instead of 'a' don't help very much": "Substitusi yang dapat diprediksi seperti '@' alih-alih 'a' tidak terlalu membantu.",
        "Avoid repeated words and characters": "Hindari kata dan karakter yang berulang.",
        "Avoid sequences": "Hindari urutan karakter berurutan.",
        "Avoid recent years": "Hindari menggunakan tahun-tahun belakangan ini.",
        "Avoid years that are associated with you": "Hindari tahun yang berkaitan dengan Anda.",
        "Avoid dates and years that are associated with you": "Hindari tanggal dan tahun yang berkaitan dengan Anda."
    }
}

class PasswordAnalyzer:
    @staticmethod
    def translate(text: str, dict_type: str) -> str:
        if not text:
            return text
        # Pencocokan persis atau menghapus titik di akhir kalimat
        if text in TRANSLATIONS[dict_type]:
            return TRANSLATIONS[dict_type][text]
        clean_text = text.rstrip('.')
        if clean_text in TRANSLATIONS[dict_type]:
            return TRANSLATIONS[dict_type][clean_text]
        return text # Jika teks tidak ada di kamus, biarkan saja (atau bisa diganti default)

    @staticmethod
    def analyze_password(password: str):
        # 1. Zxcvbn Analysis
        zxcvbn_result = zxcvbn(password)
        zxcvbn_score = zxcvbn_result['score']
        base_score = (zxcvbn_score / 4) * 55

        # 2. Rule-Based Checking
        length = RuleChecker.check_length(password)
        variation = RuleChecker.check_character_variation(password)
        has_repetition = RuleChecker.check_repetition(password)
        has_sequence = RuleChecker.check_sequence(password)
        
        # 3. Cek Kebocoran (HIBP)
        is_breached, breach_count = HibpChecker.check_breached_password(password)

        length_score = min((length / 12) * 20, 20) if length > 0 else 0
        var_count = sum(variation.values())
        var_score = (var_count / 4) * 15

        pattern_score = 10
        if has_repetition or has_sequence:
            pattern_score = 0

        # 4. Hitung Skor Akhir
        final_score = int(base_score + length_score + var_score + pattern_score)
        
        # PENALTI KEBOCORAN
        if is_breached:
            final_score = min(final_score, 20)
        else:
            final_score = min(final_score, 100)

        # 5. Kategori
        if final_score <= 20:
            category = "Sangat Lemah"
        elif final_score <= 40:
            category = "Lemah"
        elif final_score <= 60:
            category = "Sedang"
        elif final_score <= 80:
            category = "Kuat"
        else:
            category = "Sangat Kuat"

        # 6. Translasi Peringatan dan Saran
        raw_warning = zxcvbn_result['feedback']['warning']
        raw_suggestions = zxcvbn_result['feedback']['suggestions']

        warning = PasswordAnalyzer.translate(raw_warning, "warnings") if raw_warning else "Tidak ditemukan pola lemah yang dominan."
        if is_breached:
             warning = f"BAHAYA: Kata sandi ini telah ditemukan dalam kebocoran data sebanyak {breach_count} kali!"

        suggestions = [PasswordAnalyzer.translate(sug, "suggestions") for sug in raw_suggestions]
        if not suggestions and not is_breached:
            suggestions = ["Gunakan kombinasi yang lebih panjang dan unik."]
        elif is_breached:
            suggestions.insert(0, "Segera ganti kata sandi ini karena sudah tidak aman untuk digunakan.")

        return {
            "score": final_score,
            "category": category,
            "password_length": length,
            "is_breached": is_breached,
            "breach_count": breach_count,
            "detected_patterns": [warning],
            "recommendations": suggestions
        }