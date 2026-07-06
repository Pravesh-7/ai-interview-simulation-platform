import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import ActiveInterview from "../components/dashboard/ActiveInterview";
import FeedbackScorecard from "../components/dashboard/FeedbackScorecard";
import { useSpeech } from "../hooks/useSpeech";
import { useInterviewAPI } from "../hooks/useInterviewAPI";

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const state = location.state;
  const questions = state?.questions || "";
  const interviewId = state?.interviewId || null;
  const activeDifficulty = state?.activeDifficulty || "";

  const { evaluating, evaluateAnswers } = useInterviewAPI(token);

  const [answers, setAnswers] = useState("");
  const [feedback, setFeedback] = useState(null);

  const { 
    isRecording, isSpeaking, startRecording, stopRecording, speakQuestions, stopSpeaking 
  } = useSpeech(setAnswers);

  const handleEvaluate = () => {
    evaluateAnswers(questions, answers, interviewId, {
      onSuccess: (fb) => setFeedback(fb)
    });
  };

  // If directly navigated without state, go to dashboard
  if (!questions && !interviewId) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-5xl font-black mb-2 text-white">Active Interview</h1>
              <p className="text-gray-400 text-xl">Answer the questions to the best of your ability.</p>
            </div>
            {feedback && (
              <button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gray-800 hover:bg-gray-700 transition px-8 py-3 rounded-full font-bold text-lg text-white"
              >
                Back to Dashboard
              </button>
            )}
          </div>

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

export default InterviewPage;
