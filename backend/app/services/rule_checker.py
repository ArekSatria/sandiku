"""Pemeriksaan aturan dasar kekuatan kata sandi.

RuleChecker digunakan sebagai pelengkap zxcvbn. Tujuannya bukan menggantikan
zxcvbn, melainkan menambahkan diagnosis eksplisit yang mudah dipahami pengguna.
"""

import re
from dataclasses import dataclass


@dataclass
class RuleAnalysis:
    length_score: int
    variation_score: int
    pattern_score: int
    detected_patterns: list[str]
    recommendations: list[str]
    penalty: int


class RuleChecker:
    KEYBOARD_SEQUENCES = [
        "qwerty",
        "asdfgh",
        "zxcvbn",
        "qazwsx",
        "123456",
        "234567",
        "345678",
        "456789",
        "987654",
        "876543",
        "765432",
        "654321",
        "abcdef",
        "bcdefg",
        "cdefgh",
    ]

    WEAK_WORDS = [
        "password",
        "admin",
        "user",
        "login",
        "rahasia",
        "sayang",
        "bismillah",
        "indonesia",
        "merdeka",
        "SANDISCAN",
    ]

    @staticmethod
    def check_length(password: str) -> int:
        return len(password)

    @staticmethod
    def get_length_score(password: str) -> int:
        length = len(password)
        if length < 8:
            return 10
        if length < 10:
            return 40
        if length < 12:
            return 65
        if length < 16:
            return 85
        return 100

    @staticmethod
    def check_character_variation(password: str) -> dict:
        return {
            "has_lower": bool(re.search(r"[a-z]", password)),
            "has_upper": bool(re.search(r"[A-Z]", password)),
            "has_digit": bool(re.search(r"\d", password)),
            "has_symbol": bool(re.search(r"[^a-zA-Z0-9]", password)),
        }

    @classmethod
    def get_variation_score(cls, password: str) -> int:
        variation = cls.check_character_variation(password)
        total = sum(variation.values())
        if total <= 1:
            return 20
        if total == 2:
            return 50
        if total == 3:
            return 80
        return 100

    @staticmethod
    def check_repetition(password: str) -> bool:
        return bool(re.search(r"(.)\1{2,}", password.lower()))

    @classmethod
    def check_sequence(cls, password: str) -> bool:
        lower_pw = password.lower()
        return any(seq in lower_pw for seq in cls.KEYBOARD_SEQUENCES)

    @classmethod
    def find_sequences(cls, password: str) -> list[str]:
        lower_pw = password.lower()
        return [seq for seq in cls.KEYBOARD_SEQUENCES if seq in lower_pw]

    @classmethod
    def find_weak_words(cls, password: str) -> list[str]:
        lower_pw = password.lower()
        return [word for word in cls.WEAK_WORDS if word in lower_pw]

    @staticmethod
    def has_year_pattern(password: str) -> bool:
        return bool(re.search(r"(19[5-9][0-9]|20[0-3][0-9])", password))

    @staticmethod
    def has_date_like_pattern(password: str) -> bool:
        return bool(
            re.search(
                r"(0[1-9]|[12][0-9]|3[01])[-_/]?(0[1-9]|1[0-2])[-_/]?(19|20)?\d{2}",
                password,
            )
        )

    @classmethod
    def analyze(cls, password: str) -> RuleAnalysis:
        detected_patterns: list[str] = []
        recommendations: list[str] = []
        penalty = 0
        pattern_score = 100

        length = len(password)
        if length < 8:
            detected_patterns.append("Panjang kata sandi kurang dari 8 karakter.")
            recommendations.append("Gunakan kata sandi minimal 12 karakter agar ruang tebakan lebih besar.")
            penalty += 20
            pattern_score -= 25
        elif length < 12:
            detected_patterns.append("Panjang kata sandi masih berada pada batas minimal.")
            recommendations.append("Pertimbangkan menggunakan frasa sandi 12 sampai 16 karakter atau lebih.")
            penalty += 5
            pattern_score -= 5

        variation = cls.check_character_variation(password)
        missing = []

        if not variation["has_lower"]:
            missing.append("huruf kecil")
        if not variation["has_upper"]:
            missing.append("huruf kapital")
        if not variation["has_digit"]:
            missing.append("angka")
        if not variation["has_symbol"]:
            missing.append("simbol")

        if missing:
            detected_patterns.append(f"Variasi karakter belum lengkap: belum memuat {', '.join(missing)}.")
            recommendations.append("Gabungkan huruf besar, huruf kecil, angka, dan simbol secara tidak mudah ditebak.")
            penalty += min(len(missing) * 3, 10)
            pattern_score -= min(len(missing) * 5, 15)

        if cls.check_repetition(password):
            detected_patterns.append("Terdapat pengulangan karakter berurutan, misalnya aaa atau 111.")
            recommendations.append("Hindari pengulangan karakter yang beruntun karena mudah ditebak mesin maupun manusia.")
            penalty += 10
            pattern_score -= 20

        sequences = cls.find_sequences(password)
        if sequences:
            detected_patterns.append(f"Terdapat pola urutan umum: {', '.join(sequences)}.")
            recommendations.append("Hindari urutan angka, alfabet, atau pola keyboard seperti 123456 dan qwerty.")
            penalty += 15
            pattern_score -= 25

        weak_words = cls.find_weak_words(password)
        if weak_words:
            detected_patterns.append(f"Terdapat kata umum yang mudah ditebak: {', '.join(weak_words)}.")
            recommendations.append("Jangan menggunakan kata umum seperti password, admin, nama aplikasi, atau istilah populer.")
            penalty += 10
            pattern_score -= 20

        if cls.has_date_like_pattern(password):
            detected_patterns.append("Terdapat pola tanggal yang mudah diasosiasikan dengan data pribadi.")
            recommendations.append("Hindari memakai tanggal lahir, tanggal penting, atau pola kalender sebagai kata sandi.")
            penalty += 10
            pattern_score -= 15
        elif cls.has_year_pattern(password):
            detected_patterns.append("Terdapat pola tahun yang mudah ditebak.")
            recommendations.append("Hindari menambahkan tahun lahir atau tahun umum di akhir kata sandi.")
            penalty += 7
            pattern_score -= 10

        if not detected_patterns:
            detected_patterns.append("Tidak ditemukan pola lemah yang dominan berdasarkan aturan dasar.")

        if not recommendations:
            recommendations.append("Pertahankan penggunaan kata sandi unik dan jangan gunakan ulang pada layanan lain.")

        return RuleAnalysis(
            length_score=cls.get_length_score(password),
            variation_score=cls.get_variation_score(password),
            pattern_score=max(0, min(100, pattern_score)),
            detected_patterns=detected_patterns,
            recommendations=recommendations,
            penalty=penalty,
        )