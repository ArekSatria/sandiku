from datetime import datetime, timedelta, timezone

# WIB adalah UTC+7. Menggunakan fixed offset agar aman di Windows
# tanpa perlu dependency tambahan tzdata.
WIB = timezone(timedelta(hours=7), name="WIB")

BULAN_INDONESIA = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
}


def now_wib() -> datetime:
    """Menghasilkan waktu saat ini berdasarkan zona waktu WIB."""
    return datetime.now(WIB)


def format_datetime_indonesia(value: datetime | str | None) -> str | None:
    """Mengubah datetime menjadi format kalender Indonesia dengan zona WIB.

    Contoh output:
    08 Juni 2026, 13:16:13 WIB
    """
    if value is None:
        return None

    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value)
        except ValueError:
            return value

    if value.tzinfo is None:
        # Jika datetime lama tidak punya timezone, anggap sebagai WIB.
        value = value.replace(tzinfo=WIB)
    else:
        value = value.astimezone(WIB)

    tanggal = value.day
    bulan = BULAN_INDONESIA[value.month]
    tahun = value.year
    jam = value.strftime("%H:%M:%S")

    return f"{tanggal:02d} {bulan} {tahun}, {jam} WIB"