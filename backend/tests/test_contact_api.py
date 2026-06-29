"""Backend API tests for portfolio (root + contact + static assets)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://engineer-portfolio-71.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Sanity ---
class TestRoot:
    def test_root_hello_world(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json() == {"message": "Hello World"}


# --- Contact endpoint ---
class TestContact:
    def test_contact_valid_payload(self, api):
        payload = {
            "name": "QA Bot",
            "email": "chandangowdaa.h17@gmail.com",
            "subject": "Automated test",
            "message": "Hello from automated test, please ignore.",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, f"Body: {r.text}"
        data = r.json()
        assert data.get("status") == "ok"
        assert "message" in data
        assert "email_id" in data and data["email_id"]

    def test_contact_invalid_email(self, api):
        payload = {
            "name": "QA Bot",
            "email": "not-an-email",
            "subject": "Invalid email test",
            "message": "This is a long enough message for validation.",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contact_short_message(self, api):
        payload = {
            "name": "QA Bot",
            "email": "chandangowdaa.h17@gmail.com",
            "subject": "Short msg test",
            "message": "short",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contact_missing_name(self, api):
        payload = {
            "email": "chandangowdaa.h17@gmail.com",
            "subject": "Missing name",
            "message": "Long enough message for the test ok.",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422


# --- Static assets reachable through the frontend host ---
class TestStaticAssets:
    def test_audio_file_reachable(self):
        r = requests.get(f"{BASE_URL}/audio/meet-me.mp3", timeout=30, stream=True)
        assert r.status_code == 200
        # Read content-length header if available
        cl = r.headers.get("content-length")
        if cl:
            assert int(cl) > 500 * 1024, f"Audio file too small: {cl} bytes"

    def test_resume_docx_reachable(self):
        r = requests.head(f"{BASE_URL}/Chandan_Gowda_AH_Resume.docx", timeout=15, allow_redirects=True)
        assert r.status_code == 200
