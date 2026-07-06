import { useState, useEffect } from "react";

export function useSpeech(setAnswers) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setAnswers(transcript.trim());
    };

    recognitionInstance.onend = () => setIsRecording(false);
    setRecognition(recognitionInstance);
  }, [setAnswers]);

  const startRecording = () => {
    if (!recognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    setAnswers("");
    try {
      recognition.start();
      setIsRecording(true);
    } catch (e) {
      console.log(e);
      if (e.name === 'InvalidStateError') {
        // Recognition is already running
        setIsRecording(true);
      } else {
        alert(`Error starting recording: ${e.message || e.name}. Please ensure your browser has microphone permissions allowed.`);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (!recognition) return;
    try { recognition.stop(); } catch (e) { console.log(e); }
  };

  const speakQuestions = (questions) => {
    if (!questions) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(questions);
    speech.lang = "en-US";
    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    isRecording,
    isSpeaking,
    startRecording,
    stopRecording,
    speakQuestions,
    stopSpeaking
  };
}
