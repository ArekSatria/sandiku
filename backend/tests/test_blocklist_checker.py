from app.services.blocklist_checker import BlocklistChecker


def test_common_password_detected():
    assert BlocklistChecker.is_common_password("password123") is True
    assert BlocklistChecker.is_common_password("admin123") is True
    assert BlocklistChecker.is_common_password("qwerty123") is True


def test_common_password_with_substitution_detected():
    assert BlocklistChecker.is_common_password("p@ssw0rd") is True


def test_strong_phrase_not_in_blocklist():
    assert BlocklistChecker.is_common_password("LangitBiru#KopiPagi27!") is False


def test_find_common_terms():
    terms = BlocklistChecker.find_common_terms("password123")
    assert "password" in terms