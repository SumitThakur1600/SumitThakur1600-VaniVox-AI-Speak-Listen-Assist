import "regenerator-runtime/runtime"; // Import the polyfill at the top

import {useState, useEffect} from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
function App() {
  const [isListening, setIsListening] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isStarting, setIsStarting] = useState(false); // Track if speech is starting
  const [isSupported, setIsSupported] = useState(true); // Track if speech recognition is supported
  const [microphonePermission, setMicrophonePermission] = useState(false); // Track microphone access
  const [isListeningForPhrase, setIsListeningForPhrase] = useState(true); // Start by listening for trigger phrase
  const [canSendData, setCanSendData] = useState(false); // Control data sending
  const [inactivityTimer, setInactivityTimer] = useState(null); // Track inactivity timer
  const apiKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;
  const micIconOn =
    "https://fonts.gstatic.com/s/i/materialicons/mic/v6/24px.svg";
  const micIconOff =
    "https://fonts.gstatic.com/s/i/materialicons/mic_off/v6/24px.svg";

  const {transcript, listening, resetTranscript} = useSpeechRecognition();

  useEffect(() => {
    // Check if speech recognition is available
    const isSpeechRecognitionAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    setIsSupported(isSpeechRecognitionAvailable);
  }, []);
  const playAudio = () => {
    // Don't play the audio if it's already played or currently playing
    if (audioPlayed || isAudioPlaying) {
      console.log("Audio is either already played or is currently playing.");
      return;
    }

    const audio = new Audio("/audio.mp3");

    // Set the isAudioPlaying to true when the audio starts playing
    setIsAudioPlaying(true);

    audio
      .play()
      .then(() => {
        console.log("Audio played successfully.");
        setAudioPlayed(true); // Set audioPlayed to true after it plays
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      })
      .finally(() => {
        // Set isAudioPlaying to false when audio finishes playing
        audio.onended = () => {
          setIsAudioPlaying(false);
        };
      });
  };

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      stream.getTracks().forEach((track) => track.stop());
      setMicrophonePermission(true);
    } catch (error) {
      console.error("Microphone access denied", error);
      setMicrophonePermission(false);
      alert("Please allow microphone access to use speech recognition.");
    }
  };

  const toggleListening = async () => {
    console.log("toggling");
    if (!microphonePermission) {
      await checkMicrophonePermission();
      if (!microphonePermission) return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      setIsStarting(true);
      resetTranscript();
      SpeechRecognition.startListening({continuous: true});
    }
    setIsListening(!listening);
  };

  useEffect(() => {
    // List of trigger phrases
    const triggerPhrases = ["vox", "vani", "hello", "hi", "hey"];
    setIsListeningForPhrase(true);
    if (
      triggerPhrases.some((phrase) =>
        transcript.toLowerCase().includes(phrase)
      ) &&
      isListeningForPhrase
    ) {
      console.log("Trigger phrase detected, starting command listening.");
      resetTranscript();
      setIsListeningForPhrase(false);
      setCanSendData(true); // Enable data sending
      SpeechRecognition.startListening({continuous: true});
      window.speechSynthesis.cancel();
    }

    if (transcript && canSendData) {
      // Reset inactivity timer whenever transcript updates
      if (inactivityTimer) clearTimeout(inactivityTimer);

      setIsListening(true);
      // Set a new timer to check inactivity
      const timer = setTimeout(async () => {
        console.log("Message saved after 3 seconds of inactivity:", transcript);

        // Send the message to the backend after inactivity
        await sendMessageToBackend(transcript);
        resetTranscript(); // Clear transcript after sending
        setIsListening(false); // Stop listening after processing
        setCanSendData(false); // Reset data sending control
      }, 3000);

      setInactivityTimer(timer); // Update the state with the new timer
    }

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer); // Cleanup inactivity timer
    };
  }, [transcript, isListeningForPhrase, canSendData]); // Dependencies
  const sendMessageToBackend = async (message) => {
    try {
      // Ensure a valid message is provided
      if (!message || typeof message !== "string" || message.trim() === "") {
        console.error("Invalid message. Please provide a valid string.");
        return;
      }

      // Send a POST request directly to the Gemini API
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [{parts: [{text: message}]}],
        },
      });
      const AiResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      console.log(AiResponse);
      function speakText(text) {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US"; // Set the language to English
          window.speechSynthesis.speak(utterance); // Speak the text
        } else {
          console.error("Speech synthesis is not supported in this browser.");
        }
      }

      // Example usage:
      speakText(AiResponse);
    } catch (error) {
      // Catch network errors or unexpected issues
      console.error("Error sending message to Gemini API:", error.message);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="absolute inset-0">
        <video
          src="../video.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="absolute top-12 text-white text-6xl sm:text-6xl font-extrabold tracking-widest sm:top-7 sm:left-12 z-10">
        Vani Vox
      </div>

      <div className="absolute top-28 text-white text-lg sm:text-xl font-light opacity-80 sm:top-[97px] sm:left-16 z-10">
        Your Personal AI Assistant
      </div>

      <div className="relative flex items-center justify-center w-full h-1/2 my-10">
        {isListeningForPhrase === false && (
          <p className="text-black text-lg"></p>
        )}
      </div>

      {!isSupported && (
        <div className="absolute bottom-20 sm:bottom-16 text-white text-lg">
          <p>Speech recognition is not supported on this device or browser.</p>
        </div>
      )}
      {!audioPlayed && (
        <div
          className="fixed bottom-14 w-64 sm:bottom:40 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-8 py-4 rounded-full cursor-pointer flex justify-center items-center text-center"
          onClick={playAudio}
        >
          Play Welcome Audio
        </div>
      )}
      {audioPlayed && (
        <div className="fixed bottom-20 sm:bottom-16 flex justify-center w-full z-10">
          <button
            onClick={toggleListening}
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-400 rounded-full shadow-2xl transition-all duration-300 mic-button"
          >
            <img
              src={listening ? micIconOn : micIconOff}
              alt={listening ? "Open Mic" : "Mic Off"}
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
          </button>
        </div>
      )}
      <div className="absolute bottom-12 sm:bottom-4 text-white opacity-70 text-xs sm:text-sm z-10">
        <p>&copy; 2024 Vani Vox. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default App;
