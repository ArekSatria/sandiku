from app.services.rule_checker import RuleChecker


def test_length_score_short_password():
    assert RuleChecker.get_length_score("Ab1!") == 10


def test_length_score_long_password():
    assert RuleChecker.get_length_score("LangitBiru#KopiPagi27!") == 100


def test_character_variation_detected():
    result = RuleChecker.check_character_variation("Abc123!")

    assert result["has_lower"] is True
    assert result["has_upper"] is True
    assert result["has_digit"] is True
    assert result["has_symbol"] is True


def test_repetition_detected():
    assert RuleChecker.check_repetition("aaa12345") is True


def test_sequence_detected():
    assert RuleChecker.check_sequence("qwerty123") is True


def test_year_pattern_detected():
    assert RuleChecker.has_year_pattern("Admin2026!") is True


def test_rule_analysis_returns_recommendations():
    result = RuleChecker.analyze("password123")

    assert result.length_score > 0
    assert result.variation_score > 0
    assert result.pattern_score >= 0
    assert isinstance(result.detected_patterns, list)
    assert isinstance(result.recommendations, list)
    assert result.penalty > 0