import json
from os import environ

from google.oauth2.service_account import Credentials
from google.cloud import translate

from config import Config

credentials = Credentials.from_service_account_info(Config.GOOGLE_CREDENTIALS)
translate_client = translate.TranslationServiceClient(credentials=credentials)

class Translator:

    @staticmethod
    def get_supported_languages(display_language_code: str = "en") -> str:

        response = translate_client.get_supported_languages(
            parent=Config.PARENT,
            display_language_code=display_language_code,
        )

        languages = [{"language": lang.language_code, "display_name": lang.display_name} for lang in response.languages]

        return json.dumps(languages)
    
    @staticmethod
    def translate_text(text: str, source_language_code: str, target_language_code: str) -> translate.Translation:

        response = translate_client.translate_text(
            parent=Config.PARENT,
            contents=[text],
            source_language_code=source_language_code,
            target_language_code=target_language_code,
        )

        return response.translations[0].translated_text