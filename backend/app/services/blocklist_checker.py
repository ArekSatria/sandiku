"""Pemeriksa daftar kata sandi umum.

Modul ini menyediakan daftar blocklist kecil untuk kebutuhan purwarupa.
Pada pengembangan produksi, daftar ini sebaiknya dipisahkan ke file teks
atau tabel database agar mudah diperbarui tanpa mengubah kode program.
"""

import re
from typing import Set


class BlocklistChecker:
    """Memeriksa apakah kata sandi termasuk kata sandi umum/lemah."""

    COMMON_PASSWORDS: Set[str] = {
        "123456",
        "1234567",
        "12345678",
        "123456789",
        "1234567890",
        "111111",
        "000000",
        "112233",
        "121212",
        "123123",
        "qwerty",
        "qwerty123",
        "qwerty12345",
        "password",
        "password1",
        "password123",
        "admin",
        "admin123",
        "administrator",
        "iloveyou",
        "welcome",
        "welcome123",
        "letmein",
        "abc123",
        "abcd1234",
        "bismillah",
        "rahasia",
        "sayang",
        "indonesia",
        "merdeka",
        "pancasila",
        "sumsel",
        "palembang",
        "SANDISCAN",
    }

    @staticmethod
    def normalize(password: str) -> str:
        """Normalisasi sederhana agar variasi umum tetap terdeteksi."""
        normalized = password.strip().lower()
        normalized = normalized.replace("@", "a")
        normalized = normalized.replace("4", "a")
        normalized = normalized.replace("0", "o")
        normalized = normalized.replace("1", "i")
        normalized = normalized.replace("!", "i")
        normalized = normalized.replace("3", "e")
        normalized = normalized.replace("5", "s")
        normalized = re.sub(r"[^a-z0-9]", "", normalized)
        return normalized

    @classmethod
    def is_common_password(cls, password: str) -> bool:
        normalized = cls.normalize(password)
        raw = password.strip().lower()
        return raw in cls.COMMON_PASSWORDS or normalized in cls.COMMON_PASSWORDS

    @classmethod
    def find_common_terms(cls, password: str) -> list[str]:
        normalized = cls.normalize(password)
        terms = []
        for item in cls.COMMON_PASSWORDS:
            if len(item) >= 5 and item in normalized:
                terms.append(item)
        return sorted(set(terms))