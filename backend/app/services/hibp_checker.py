"""Pemeriksaan kebocoran kata sandi melalui Have I Been Pwned.

Pemeriksaan memakai mekanisme k-Anonymity: aplikasi hanya mengirim lima
karakter pertama hash SHA-1 ke HIBP, bukan kata sandi asli.
"""

import hashlib
from typing import Literal, TypedDict

import requests


class HibpResult(TypedDict):
    is_breached: bool
    breach_count: int
    check_status: Literal["checked", "failed"]
    error: str | None


class HibpChecker:
    API_URL = "https://api.pwnedpasswords.com/range/{prefix}"

    @staticmethod
    def check_breached_password(password: str, timeout: int = 5) -> HibpResult:
        sha1_password = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
        prefix, suffix = sha1_password[:5], sha1_password[5:]

        try:
            response = requests.get(
                HibpChecker.API_URL.format(prefix=prefix),
                timeout=timeout,
                headers={"User-Agent": "SANDIKU-Password-Analyzer"},
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            return {
                "is_breached": False,
                "breach_count": 0,
                "check_status": "failed",
                "error": str(exc),
            }

        for line in response.text.splitlines():
            try:
                hash_suffix, count = line.split(":")
            except ValueError:
                continue

            if hash_suffix == suffix:
                return {
                    "is_breached": True,
                    "breach_count": int(count),
                    "check_status": "checked",
                    "error": None,
                }

        return {
            "is_breached": False,
            "breach_count": 0,
            "check_status": "checked",
            "error": None,
        }