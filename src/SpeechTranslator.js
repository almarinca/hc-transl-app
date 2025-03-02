import './index.css';
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_API_URL}`);

export default function SpeechTranslator() {
  const [partialTranscript, setPartialTranscript] = useState("");
  const [transcript, setTranscript] = useState("");
  const [partialTranslatedText, setPartialTranslatedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [sourceLang, setSourceLang] = useState("es");
  const [targetLang, setTargetLang] = useState("en");
  const [languages, setLanguages] = useState([]);

  let lastInterimTranscript = ""; // Store the last interim transcript
  let translateBuffer = "";
  let shouldClearPartialTranslation  = false; // to message the socket on thread to clear partial transaltion
  
  const transcriptBuffer = useRef(""); // Store intermediate text
  const intervalRef = useRef(null); // Store interval reference

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/languages`)
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => console.error("Error fetching languages:", error));
  }, []);

  const setTranslateBuffer = (translation) => {
    translateBuffer = translation;
    if (shouldClearPartialTranslation ) {
      setPartialTranslatedText("");
      shouldClearPartialTranslation  = false;
    }
  }

  const enableTranslation = () => {
    socket.on("translation_result", (data) => {
      setPartialTranslatedText(data.translatedText.replace(/&#39;/g, "'"));
      setTranslateBuffer(data.translatedText.replace(/&#39;/g, "'"));
    });
  };

  const disableTranslation = () => {
    socket.off("translation_result");
  };

  const stopListening = () => {
    disableTranslation();
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setPartialTranslatedText("");
    clearInterval(intervalRef.current); // Stop emitting when stopped
  };

  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.lang = sourceLang;
    recognitionInstance.continuous = true; // Ensures short speech segments
    recognitionInstance.interimResults = true; // Get partial results

    enableTranslation();

    recognitionInstance.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript + " ";
        }
      }

      interimTranscript = interimTranscript.trim();
      finalTranscript = finalTranscript.trim();

      // Emit interim results if they are different from the last one
      if (interimTranscript && interimTranscript !== lastInterimTranscript) {
        lastInterimTranscript = interimTranscript;
        setPartialTranscript(lastInterimTranscript);
        transcriptBuffer.current = lastInterimTranscript;
      }

      // Emit final results and reset interim tracking
      if (finalTranscript) {
        setTranslatedText(prev => prev + (prev ? " " : "") + translateBuffer.toUpperCase());
        setPartialTranslatedText("");
        setTranscript(prev => prev + (prev ? " " : "") + finalTranscript.toUpperCase());
        lastInterimTranscript = ""; // Reset to avoid carry-over
        setPartialTranscript("");
        setPartialTranslatedText(""); // one more time just to be sure
        shouldClearPartialTranslation  = true;
      }
    };

    recognitionInstance.onend = () => {
      stopListening();  // Stop emitting when recognition ends
      setPartialTranslatedText("")
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);

    // Start emitting every second
    intervalRef.current = setInterval(() => {
      if (transcriptBuffer.current.trim()) {
        socket.emit("translate", { text: transcriptBuffer.current, sourceLang: sourceLang, targetLang: targetLang });
        transcriptBuffer.current = ""; // Clear buffer after emitting
      }
    }, 1000);

  };

  const speakText = () => {
    if (!translatedText) return;
    const speech = new SpeechSynthesisUtterance(translatedText);
    speech.lang = targetLang;
    window.speechSynthesis.speak(speech);
  };

  const resetText = () => {
    setTranscript("");    
    setPartialTranscript("");
    setPartialTranslatedText("");
    setTranslatedText("");
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-700 rounded overflow-hidden" style={{marginTop:24}}>
        <div className="flex items-center border border-gray-600 rounded">
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-1/2 p-2 bg-gray-700 rounded">
            {languages.map((lang) => (
              <option key={lang.language} value={lang.language}>
                {lang.display_name}
              </option>
            ))}
          </select>
          <button onClick={swapLanguages} className="p-2 bg-gray-700 text-white cursor-pointer">⇄</button>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-1/2 p-2 bg-gray-700 rounded">
            {languages.map((lang) => (
              <option key={lang.language} value={lang.language}>
                {lang.display_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col md:flex-row border border-gray-600 rounded h-[500px] w-full">
          <div className="relative flex-1 p-4 bg-gray-800 text-white border-gray-500 md:border-r border-b md:border-b-0 rounded md:rounded-none w-full h-full min-h-[250px] no-scrollbar">
            <p className="w-full h-full pb-12 overflow-y-auto no-scrollbar" >
              {transcript + " " + partialTranscript} 
            </p>
            <div className="absolute bottom-4 left-4">
              {recognition === null ? (
                <button onClick={startListening} className="p-2 bg-blue-500 text-white rounded-full cursor-pointer">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" data-name="MicrophoneSmall" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7.70186 1.86859C8.31135 1.2591 9.13801 0.916687 9.99996 0.916687C10.8619 0.916687 11.6886 1.2591 12.2981 1.86859C12.9075 2.47808 13.25 3.30473 13.25 4.16669V10C13.25 10.862 12.9075 11.6886 12.2981 12.2981C11.6886 12.9076 10.8619 13.25 9.99996 13.25C9.13801 13.25 8.31135 12.9076 7.70186 12.2981C7.09237 11.6886 6.74996 10.862 6.74996 10V4.16669C6.74996 3.30473 7.09237 2.47808 7.70186 1.86859ZM9.99996 2.41669C9.53583 2.41669 9.09071 2.60106 8.76252 2.92925C8.43433 3.25744 8.24996 3.70256 8.24996 4.16669V10C8.24996 10.4641 8.43433 10.9093 8.76252 11.2375C9.09071 11.5656 9.53583 11.75 9.99996 11.75C10.4641 11.75 10.9092 11.5656 11.2374 11.2375C11.5656 10.9093 11.75 10.4641 11.75 10V4.16669C11.75 3.70256 11.5656 3.25744 11.2374 2.92925C10.9092 2.60106 10.4641 2.41669 9.99996 2.41669ZM4.16663 7.58335C4.58084 7.58335 4.91663 7.91914 4.91663 8.33335V10C4.91663 11.3482 5.45219 12.6412 6.4055 13.5945C7.35881 14.5478 8.65178 15.0834 9.99996 15.0834C11.3481 15.0834 12.6411 14.5478 13.5944 13.5945C14.5477 12.6412 15.0833 11.3482 15.0833 10V8.33335C15.0833 7.91914 15.4191 7.58335 15.8333 7.58335C16.2475 7.58335 16.5833 7.91914 16.5833 8.33335V10C16.5833 11.746 15.8897 13.4205 14.6551 14.6551C13.5986 15.7117 12.2199 16.372 10.75 16.5405V18.3334C10.75 18.7476 10.4142 19.0834 9.99996 19.0834C9.58575 19.0834 9.24996 18.7476 9.24996 18.3334V16.5405C7.78002 16.372 6.40136 15.7117 5.34484 14.6551C4.11023 13.4205 3.41663 11.746 3.41663 10V8.33335C3.41663 7.91914 3.75241 7.58335 4.16663 7.58335Z" fillRule="evenodd" clipRule="evenodd" vectorEffect="non-scaling-stroke"></path></svg>
                </button>
              ) : (
                <button onClick={stopListening} className="p-2 bg-red-500 text-white rounded-full cursor-pointer">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" data-name="SpeakerStopMedium" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M5 3.75C4.30964 3.75 3.75 4.30964 3.75 5V19C3.75 19.6904 4.30964 20.25 5 20.25H19C19.6904 20.25 20.25 19.6904 20.25 19V5C20.25 4.30964 19.6904 3.75 19 3.75H5ZM2.25 5C2.25 3.48122 3.48122 2.25 5 2.25H19C20.5188 2.25 21.75 3.48122 21.75 5V19C21.75 20.5188 20.5188 21.75 19 21.75H5C3.48122 21.75 2.25 20.5188 2.25 19V5Z" fillRule="evenodd" clipRule="evenodd" vectorEffect="non-scaling-stroke"></path></svg>
                </button>
              )}
            </div>
            <div className="absolute bottom-4 right-4">
              <button onClick={resetText} className="p-2 bg-blue-500 text-white rounded-full cursor-pointer">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" data-name="XMarkSmall" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.46967 4.46967C4.76256 4.17678 5.23744 4.17678 5.53033 4.46967L10 8.93934L14.4697 4.46967C14.7626 4.17678 15.2374 4.17678 15.5303 4.46967C15.8232 4.76256 15.8232 5.23744 15.5303 5.53033L11.0607 10L15.5303 14.4697C15.8232 14.7626 15.8232 15.2374 15.5303 15.5303C15.2374 15.8232 14.7626 15.8232 14.4697 15.5303L10 11.0607L5.53033 15.5303C5.23744 15.8232 4.76256 15.8232 4.46967 15.5303C4.17678 15.2374 4.17678 14.7626 4.46967 14.4697L8.93934 10L4.46967 5.53033C4.17678 5.23744 4.17678 4.76256 4.46967 4.46967Z" fillRule="evenodd" clipRule="evenodd" vectorEffect="non-scaling-stroke"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="relative flex-1 p-4 bg-gray-800 text-white border-gray-500 md:border-r border-b md:border-b-0 rounded md:rounded-none w-full h-full min-h-[250px] no-scrollbar">
            <p className="w-full h-full pb-12 overflow-y-auto no-scrollbar" >
              {translatedText + " " + partialTranslatedText}  
            </p>
            <div className="absolute bottom-4 right-4">
              <button onClick={speakText} className="p-2 bg-blue-500 text-white rounded-full cursor-pointer">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" data-name="SpeakerWaveMedium" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.67678 8.38387L10.25 4.81065V19.1893L6.67678 15.6161C6.44236 15.3817 6.12441 15.25 5.79289 15.25H2.75V8.74999H5.79289C6.12441 8.74999 6.44236 8.61829 6.67678 8.38387ZM11.75 4.2071C11.75 3.09347 10.4036 2.53575 9.61612 3.32321L5.68934 7.24999H2.5C1.80964 7.24999 1.25 7.80963 1.25 8.49999V15.5C1.25 16.1903 1.80964 16.75 2.5 16.75H5.68934L9.61612 20.6768C10.4036 21.4642 11.75 20.9065 11.75 19.7929V4.2071ZM19.8943 5.1059C19.6014 4.81301 19.1266 4.81301 18.8337 5.1059C18.5408 5.3988 18.5408 5.87367 18.8337 6.16656C19.5998 6.93265 20.2075 7.84213 20.6221 8.84307C21.0367 9.84401 21.2501 10.9168 21.2501 12.0002C21.2501 13.0836 21.0367 14.1564 20.6221 15.1574C20.2075 16.1583 19.5998 17.0678 18.8337 17.8339C18.5408 18.1268 18.5408 18.6017 18.8337 18.8946C19.1266 19.1875 19.6014 19.1875 19.8943 18.8946C20.7997 17.9892 21.5179 16.9144 22.0079 15.7314C22.4979 14.5485 22.7501 13.2806 22.7501 12.0002C22.7501 10.7198 22.4979 9.45197 22.0079 8.26904C21.5179 7.08611 20.7997 6.01127 19.8943 5.1059ZM16.6 8.55023C16.3515 8.21886 15.8814 8.1517 15.55 8.40023C15.2186 8.64876 15.1515 9.11886 15.4 9.45023C15.9517 10.1859 16.25 11.0807 16.25 12.0002C16.25 12.9198 15.9517 13.8146 15.4 14.5502C15.1515 14.8816 15.2186 15.3517 15.55 15.6002C15.8814 15.8488 16.3515 15.7816 16.6 15.4502C17.3465 14.4549 17.75 13.2444 17.75 12.0002C17.75 10.7561 17.3465 9.54553 16.6 8.55023Z" fillRule="evenodd" clipRule="evenodd" vectorEffect="non-scaling-stroke"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
