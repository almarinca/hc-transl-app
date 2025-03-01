"""Class-based Flask app configuration."""

from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))


class Config:
    """Set Flask configuration from environment variables."""

    # General Config
    ENVIRONMENT = environ.get("ENVIRONMENT")

    # Flask Config
    FLASK_APP = "run.py"
    SECRET_KEY = environ.get("SECRET_KEY")
    FLASK_DEBUG = environ.get("FLASK_DEBUG")

    # Google Translation API setup    
    PROJECT_ID = environ.get("GOOGLE_PROJECT_ID")
    PARENT = f"projects/{PROJECT_ID}"

    # Load credentials from environment variables
    GOOGLE_CREDENTIALS = {
        "type": "service_account",
        "project_id": environ.get("GOOGLE_PROJECT_ID"),
        "private_key_id": environ.get("GOOGLE_PRIVATE_KEY_ID"),
        "private_key": environ.get("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": environ.get("GOOGLE_CLIENT_EMAIL"),
        "token_uri": "https://oauth2.googleapis.com/token",
    }

