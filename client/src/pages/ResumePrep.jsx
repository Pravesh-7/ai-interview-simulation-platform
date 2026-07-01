import { useState, useEffect } from "react";
// Components
import Sidebar from "../components/layout/Sidebar";
import ResumeGenerator from "../components/dashboard/ResumeGenerator";
import ActiveInterview from "../components/dashboard/ActiveInterview";
import FeedbackScorecard from "../components/dashboard/FeedbackScorecard";

// Hooks
import { useSpeech } from "../hooks/useSpeech";
import { useInterviewAPI } from "../hooks/useInterviewAPI";

function ResumePrep() {
  const token = localStorage.getItem("token");
  
  // API State & Handlers
  const { 
    loading, evaluating, 
    generateQuestions, evaluateAnswers 
  } = useInterviewAPI(token);

  // Local Interview State
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [activeDifficulty, setActiveDifficulty] = useState("");

  // Speech Hooks
  const { 
    isRecording, isSpeaking, startRecording, stopRecording, speakQuestions, stopSpeaking 
  } = useSpeech(setAnswers);

  const handleGenerate = (params) => {
    const { role, difficulty, questionCount, resume, focusArea } = params;
    setQuestions("");
    setAnswers("");
    setFeedback(null);
    setInterviewId(null);
    setActiveDifficulty(difficulty);
    
    generateQuestions(role, difficulty, questionCount, resume, focusArea, {
      onSuccess: (generatedQuestions, id) => {
        setQuestions(generatedQuestions);
        setInterviewId(id);
      }
    });
  };

  const handleEvaluate = () => {
    evaluateAnswers(questions, answers, interviewId, {
      onSuccess: (fb) => setFeedback(fb)
    });
  };

  const startNewInterview = () => {
    setQuestions("");
    setAnswers("");
    setFeedback(null);
    setInterviewId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-5xl font-black mb-2 text-white">Resume Prep</h1>
              <p className="text-gray-400 text-xl">Generate hyper-personalized questions from your CV.</p>
            </div>
            <button onClick={startNewInterview} className="bg-purple-600 hover:bg-purple-500 transition px-8 py-3 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              New Interview
            </button>
          </div>
          
          <ResumeGenerator onGenerate={handleGenerate} loading={loading} />

          <ActiveInterview
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            evaluating={evaluating}
            feedback={feedback}
            activeDifficulty={activeDifficulty}
            evaluateAnswers={handleEvaluate}
            isRecording={isRecording}
            isSpeaking={isSpeaking}
            startRecording={startRecording}
            stopRecording={stopRecording}
            speakQuestions={speakQuestions}
            stopSpeaking={stopSpeaking}
          />

          <FeedbackScorecard feedback={feedback} />

        </div>
      </div>
    </div>
  );
}

export default ResumePrep;
