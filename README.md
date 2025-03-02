# Healthcare Translation Web App with Generative AI

![image](https://github.com/user-attachments/assets/01149083-2afb-42bd-9446-cefea6f78e08)

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

## Generative AI for Productivity & Rapid Prototyping
Generative AI was leveraged in this project to enhance development efficiency and speed up prototyping. It was primarily used for:
- Generating code boilerplate to accelerate development.
- Creating HTML structure for React components.
- Rapidly prompting for specific HTML layouts.
- Styling the application efficiently using Tailwind CSS classes.
- Obtaining code samples to resolve specific app functionalities.
- Performing rapid searches on specific technologies and language syntax.
- Utilizing AI-powered code suggestions directly in the code editor for live assistance.

## Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

- Python 3.x
- Node.js and npm
- Virtual environment for Python (optional but recommended)

### Frontend Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```

### Backend Setup
1. Navigate to the `api` directory:
   ```sh
   cd api
   ```
2. Create and activate a virtual environment (optional):
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```sh
   python run.py
   ```

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

