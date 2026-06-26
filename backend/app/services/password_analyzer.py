"""Mesin analisis kekuatan kata sandi SANDISCAN.

Modul ini menggabungkan beberapa pendekatan analisis, yaitu:
1. zxcvbn untuk estimasi kekuatan berbasis pola manusia,
2. pemeriksaan aturan dasar,
3. pemeriksaan blocklist lokal,
4. pemeriksaan kebocoran kata sandi melalui Have I Been Pwned.

Seluruh output yang dikirim ke pengguna dibuat dalam bahasa Indonesia
agar sesuai dengan kebutuhan laporan dan antarmuka sistem.
"""

from zxcvbn import zxcvbn

from app.services.blocklist_checker import BlocklistChecker
from app.services.hibp_checker import HibpChecker
from app.services.rule_checker import RuleChecker


class PasswordAnalyzer:
    """Menggabungkan zxcvbn, aturan dasar, blocklist, dan HIBP."""

    ZXCVBN_SCORE_MAP = {
        0: 0,
        1: 25,
        2: 50,
        3: 75,
        4: 100,
    }

    ZXCVBN_TRANSLATIONS = {
        "this is a very common password.": "Kata sandi ini sangat umum digunakan dan mudah ditebak.",
        "this is similar to a commonly used password.": "Kata sandi ini mirip dengan kata sandi umum yang sering digunakan.",
        "a word by itself is easy to guess.": "Satu kata tunggal mudah ditebak.",
        "names and surnames by themselves are easy to guess.": "Nama pribadi atau nama keluarga mudah ditebak apabila digunakan sebagai kata sandi.",
        "common names and surnames are easy to guess.": "Nama umum mudah ditebak apabila digunakan sebagai kata sandi.",
        "straight rows of keys are easy to guess.": "Urutan tombol keyboard mudah ditebak.",
        "short keyboard patterns are easy to guess.": "Pola keyboard yang pendek mudah ditebak.",
        "repeats like \"aaa\" are easy to guess.": "Pengulangan karakter seperti aaa mudah ditebak.",
        "repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\".": "Pengulangan pola seperti abcabcabc tetap mudah ditebak.",
        "sequences like abc or 6543 are easy to guess.": "Urutan seperti abc atau 6543 mudah ditebak.",
        "recent years are easy to guess.": "Tahun yang umum atau baru-baru ini mudah ditebak.",
        "dates are often easy to guess.": "Pola tanggal sering kali mudah ditebak.",
        "this is a top-10 common password.": "Kata sandi ini termasuk salah satu kata sandi paling umum.",
        "this is a top-100 common password.": "Kata sandi ini termasuk dalam daftar kata sandi yang sangat sering digunakan.",
        "this is a very common password": "Kata sandi ini sangat umum digunakan dan mudah ditebak.",
        "add another word or two. uncommon words are better.": "Tambahkan satu atau dua kata yang tidak umum agar kata sandi lebih sulit ditebak.",
        "use a longer keyboard pattern with more turns.": "Gunakan pola yang lebih panjang dan tidak mengikuti urutan keyboard.",
        "avoid repeated words and characters.": "Hindari pengulangan kata atau karakter.",
        "avoid sequences.": "Hindari penggunaan urutan angka, huruf, atau tombol keyboard.",
        "avoid recent years.": "Hindari penggunaan tahun yang mudah ditebak.",
        "avoid years that are associated with you.": "Hindari penggunaan tahun yang berkaitan dengan data pribadi.",
        "avoid dates and years that are associated with you.": "Hindari penggunaan tanggal atau tahun yang berkaitan dengan data pribadi.",
        "capitalization doesn't help very much.": "Penggunaan huruf kapital saja tidak cukup untuk membuat kata sandi kuat.",
        "all-uppercase is almost as easy to guess as all-lowercase.": "Semua huruf kapital hampir sama mudah ditebak seperti semua huruf kecil.",
        "reversed words aren't much harder to guess.": "Kata yang dibalik tetap tidak jauh lebih sulit ditebak.",
        "predictable substitutions like '@' instead of 'a' don't help very much.": "Substitusi umum seperti @ untuk a tidak banyak meningkatkan keamanan.",
    }

    @classmethod
    def translate_zxcvbn_message(cls, message: str | None) -> str | None:
        """Menerjemahkan pesan zxcvbn ke bahasa Indonesia.

        Jika pesan tidak dikenali, pesan tidak ditampilkan agar output sistem
        tetap konsisten menggunakan bahasa Indonesia.
        """
        if not message:
            return None

        normalized_message = message.strip().lower()
        return cls.ZXCVBN_TRANSLATIONS.get(normalized_message)

    @staticmethod
    def determine_category(score: int) -> str:
        if score <= 20:
            return "Sangat Lemah"
        if score <= 40:
            return "Lemah"
        if score <= 60:
            return "Sedang"
        if score <= 80:
            return "Kuat"
        return "Sangat Kuat"

    @staticmethod
    def calculate_weighted_score(
        zxcvbn_score: int,
        length_score: int,
        variation_score: int,
        pattern_score: int,
    ) -> int:
        zxcvbn_percent = PasswordAnalyzer.ZXCVBN_SCORE_MAP.get(zxcvbn_score, 0)

        final_score = (
            (zxcvbn_percent * 0.55)
            + (length_score * 0.20)
            + (variation_score * 0.15)
            + (pattern_score * 0.10)
        )

        return round(final_score)

    @staticmethod
    def normalize_unique_items(items: list[str]) -> list[str]:
        """Menghapus duplikasi pesan tanpa mengubah urutan."""
        return list(dict.fromkeys(item for item in items if item and item.strip()))

    @staticmethod
    def analyze_password(password: str) -> dict:
        clean_password = password or ""

        zxcvbn_result = zxcvbn(clean_password)
        zxcvbn_score = int(zxcvbn_result.get("score", 0))
        zxcvbn_feedback = zxcvbn_result.get("feedback", {}) or {}

        rule_result = RuleChecker.analyze(clean_password)
        hibp_result = HibpChecker.check_breached_password(clean_password)

        score = PasswordAnalyzer.calculate_weighted_score(
            zxcvbn_score=zxcvbn_score,
            length_score=rule_result.length_score,
            variation_score=rule_result.variation_score,
            pattern_score=rule_result.pattern_score,
        )

        score = max(0, min(100, score - rule_result.penalty))

        detected_patterns = list(rule_result.detected_patterns)
        recommendations = list(rule_result.recommendations)

        translated_warning = PasswordAnalyzer.translate_zxcvbn_message(
            zxcvbn_feedback.get("warning")
        )

        if translated_warning:
            detected_patterns.append(translated_warning)

        suggestions = zxcvbn_feedback.get("suggestions") or []
        for suggestion in suggestions:
            translated_suggestion = PasswordAnalyzer.translate_zxcvbn_message(suggestion)
            if translated_suggestion:
                recommendations.append(translated_suggestion)

        is_common_password = BlocklistChecker.is_common_password(clean_password)
        common_terms = BlocklistChecker.find_common_terms(clean_password)

        if is_common_password:
            score = min(score, 25)
            detected_patterns.append(
                "Kata sandi terdeteksi sebagai kata sandi umum dalam blocklist lokal."
            )
            recommendations.append(
                "Ganti kata sandi ini dengan frasa sandi unik yang tidak berasal dari daftar kata sandi umum."
            )
        elif common_terms:
            detected_patterns.append(
                "Memuat istilah umum yang sering ditemukan pada kata sandi lemah: "
                + ", ".join(common_terms)
                + "."
            )
            recommendations.append(
                "Hindari penggunaan istilah umum, nama instansi, nama aplikasi, atau kata populer."
            )

        if len(clean_password) < 8:
            score = min(score, 20)

        if hibp_result["is_breached"]:
            score = min(score, 20)
            detected_patterns.append(
                "BAHAYA: Kata sandi ini ditemukan dalam basis data kebocoran publik "
                f"sebanyak {hibp_result['breach_count']} kali."
            )
            recommendations.append(
                "Segera ganti kata sandi ini karena sudah tidak aman untuk digunakan."
            )
            recommendations.append(
                "Jangan gunakan ulang kata sandi yang pernah bocor pada layanan apa pun."
            )
        elif hibp_result["check_status"] == "failed":
            detected_patterns.append(
                "Pemeriksaan kebocoran HIBP gagal dilakukan karena layanan eksternal tidak dapat diakses."
            )
            recommendations.append(
                "Ulangi pemeriksaan ketika koneksi stabil sebelum menyimpulkan kata sandi aman dari riwayat kebocoran."
            )

        detected_patterns = PasswordAnalyzer.normalize_unique_items(detected_patterns)
        recommendations = PasswordAnalyzer.normalize_unique_items(recommendations)

        category = PasswordAnalyzer.determine_category(score)

        return {
            "score": score,
            "category": category,
            "password_length": len(clean_password),
            "is_breached": hibp_result["is_breached"],
            "breach_count": hibp_result["breach_count"],
            "hibp_status": hibp_result["check_status"],
            "detected_patterns": detected_patterns,
            "recommendations": recommendations,
        }