from app.core.html_sanitizer import sanitize_chart_html


def test_canvas_attributes_are_clamped():
    html = '<canvas width="1200" height="900"></canvas>'
    sanitized = sanitize_chart_html(html)
    assert 'width="600"' in sanitized
    assert 'height="400"' in sanitized


def test_canvas_style_dimensions_are_clamped():
    html = '<canvas style="width: 900px; height: 850px; background: red;"></canvas>'
    sanitized = sanitize_chart_html(html)
    assert 'width: 600px' in sanitized
    assert 'height: 400px' in sanitized
    # Ensure other declarations remain
    assert 'background: red' in sanitized


def test_non_canvas_height_is_clamped():
    html = '<div style="height: 1200px; width: 100%"></div>'
    sanitized = sanitize_chart_html(html)
    assert 'height: 400px' in sanitized
    assert 'width: 100%' in sanitized


def test_invalid_html_returns_original():
    broken_html = '<canvas width="1000"'
    sanitized = sanitize_chart_html(broken_html)
    assert sanitized == broken_html


def test_style_without_colon_is_preserved():
    html = '<div style="display"></div>'
    sanitized = sanitize_chart_html(html)
    assert 'style="display"' in sanitized


def test_px_with_important_suffix_is_clamped():
    html = '<div style="height: 1200px !important;"></div>'
    sanitized = sanitize_chart_html(html)
    assert 'height: 400px !important' in sanitized
