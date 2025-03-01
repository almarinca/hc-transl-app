# Healthcare Translation Web App with Generative AI

## Overview

This project is a prototype for a web-based application designed to enable real-time, multilingual translation between patients and healthcare providers. It was developed within 48 hours as part of a job application test to demonstrate technical proficiency, speed, and use of generative AI in application development.

## Features

- **Real-Time Speech-to-Text**: Converts spoken input into a text transcript using the Web Speech API.
- **Live Translation**: Translates the transcribed text into a target language using the Google Translate API.
- **Audio Playback**: Allows users to play back the translated text using the Web Speech Synthesis API.
- **Language Selection**: Users can select input and output languages dynamically.
- **Dual Transcript Display**: Displays both the original and translated text in real-time.
- **Mobile-First Design**: Fully responsive UI optimized for both mobile and desktop devices.

## Technology Stack

### Frontend:

- **React** (for building the UI)
- **Web Speech API** (for real-time speech recognition)
- **Web Speech Synthesis API** (for text-to-speech playback)
- **Socket.io** (for real-time communication with the backend)

### Backend:

- **Python Flask** (for handling API requests and WebSockets communication)
- **Google Translate API** (for language translation)
- **Socket.io** (for real-time data exchange between frontend and backend)

## Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (for running the frontend)
- Python 3 (for the Flask backend)
- pip (for managing Python dependencies)

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd api
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv .venv
   source .venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```sh
   python run.py
   ```

### Frontend Setup

1. Navigate to the project root directory:
   ```sh
   cd ..
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

The app should now be running on `http://localhost:3000`, with the backend on `http://localhost:5000`.

## Deployment

The application is designed to be deployed using **Vercel** for the frontend and a cloud-based platform for the Flask backend (e.g., Render, AWS, or Google Cloud). Steps for deployment can be added as required.

## Usage

1. Select the input and output languages.
2. Click the microphone button to start speaking.
3. View real-time transcription and translation.
4. Click the "Speak" button to listen to the translated text.
5. Click the "Reset" button to clear the text fields.

## Security Considerations

- **Data Privacy**: No user data is stored or transmitted beyond the necessary API requests.
- **Secure WebSocket Communication**: Ensures real-time data exchange without exposing sensitive information.

## Future Improvements

- Add user authentication for personalized settings.
- Improve support for medical terminology using custom language models.
- Implement better error handling and offline support.

## License

This project is for demonstration purposes only and is not licensed for production use.

