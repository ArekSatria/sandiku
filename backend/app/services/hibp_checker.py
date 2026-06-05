import hashlib
import requests

class HibpChecker:
    @staticmethod
    def check_breached_password(password: str) -> tuple[bool, int]:
        # Hash password dengan SHA-1
        sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        # Ambil 5 karakter pertama untuk dikirim (k-anonymity)
        prefix, suffix = sha1_password[:5], sha1_password[5:]
        
        try:
            response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}")
            if response.status_code != 200:
                return False, 0
            
            # Cek apakah suffix (sisa hash) ada di data kebocoran
            hashes = (line.split(':') for line in response.text.splitlines())
            for h, count in hashes:
                if h == suffix:
                    return True, int(count) # Mengembalikan True dan jumlah kebocoran
            return False, 0
        except Exception:
            return False, 0