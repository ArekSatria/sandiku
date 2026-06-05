import re

class RuleChecker:
    @staticmethod
    def check_length(password: str) -> int:
        return len(password)

    @staticmethod
    def check_character_variation(password: str) -> dict:
        return {
            "has_lower": bool(re.search(r'[a-z]', password)),
            "has_upper": bool(re.search(r'[A-Z]', password)),
            "has_digit": bool(re.search(r'\d', password)),
            "has_symbol": bool(re.search(r'[^a-zA-Z0-9]', password))
        }

    @staticmethod
    def check_repetition(password: str) -> bool:
        # Mendeteksi jika ada karakter yang diulang 3x atau lebih (contoh: aaa, 111)
        return bool(re.search(r'(.)\1{2,}', password))

    @staticmethod
    def check_sequence(password: str) -> bool:
        # Mendeteksi pola urutan keyboard umum
        sequences = ['123456', 'abcdef', 'qwerty', 'asdfgh']
        lower_pw = password.lower()
        return any(seq in lower_pw for seq in sequences)