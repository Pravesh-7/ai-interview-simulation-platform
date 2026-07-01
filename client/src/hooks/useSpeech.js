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
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswers(transcript);
    };

    recognitionInstance.onend = () => setIsRecording(false);
    setRecognition(recognitionInstance);
  }, [setAnswers]);

  const startRecording = () => {
    if (!recognition) return;
    setAnswers("");
    recognition.start();
    setIsRecording(true);
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
