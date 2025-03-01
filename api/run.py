"""App entry point."""

from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS


from translator import Translator


app = Flask(__name__)
app.config.from_object("config.Config")

# Enable both WebSockets and HTTP
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)  # Enable CORS for all routes, later specify origin for production


@app.route('/languages')
def list_available_languages():
    languages = Translator.get_supported_languages()
    return languages


# Translate text via HTTP
@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json()
    print(data)
    text = data.get("text", "")
    source_lang = data.get("sourceLang")
    target_lang = data.get("targetLang")

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    translated = Translator.translate_text(text, source_language_code=source_lang, target_language_code=target_lang)
    return jsonify({"translatedText": translated}), 200


# WebSocket Live Translation
@socketio.on("translate")
def handle_translation(data):
    text = data.get("text", "")
    src_lang = data.get("sourceLang")
    dest_lang = data.get("targetLang")

    if text.strip():
        translated = Translator.translate_text(text, source_language_code=src_lang, target_language_code=dest_lang)
        socketio.emit("translation_result", {"translatedText": translated})


if __name__ == '__main__':    
    socketio.run(app, host='0.0.0.0', port=8080)