import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaHistory,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

// Components
import PerformanceCharts from "../components/dashboard/PerformanceCharts";
import InterviewGenerator from "../components/dashboard/InterviewGenerator";
import Timer from "../components/dashboard/Timer";
import WebcamSimulation from "../components/dashboard/WebcamSimulation";
import CodeEditor from "../components/dashboard/CodeEditor";
import InterviewHistory from "../components/dashboard/InterviewHistory";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState("");
  
  // Audio/Speech States
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/interview/history", {
        headers: { authorization: token }
      });
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteInterview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/interview/${id}`, { headers: { authorization: token } });
      toast.success("Interview deleted");
      fetchHistory();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete interview");
    }
  };

  const deleteAllInterviews = async () => {
    if (history.length === 0) return;
    if (!window.confirm("Are you sure you want to delete ALL interviews? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/interview`, { headers: { authorization: token } });
      toast.success("All interviews deleted");
      setHistory([]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete interviews");
    }
  };

  // Speech Recognition Setup
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
  }, []);

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

  const speakQuestions = () => {
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

  const generateQuestions = async ({ role, difficulty, questionCount, resume }) => {
    try {
      setQuestions("");
      setAnswers("");
      setFeedback(null);
      setInterviewId(null);
      setLoading(true);
      setActiveDifficulty(difficulty);

      let res;
      if (resume) {
        toast.loading("Parsing Resume & Generating...", { id: "generate" });
        const formData = new FormData();
        formData.append("role", role);
        formData.append("difficulty", difficulty);
        formData.append("questionCount", questionCount);
        formData.append("resume", resume);

        res = await axios.post("http://localhost:5000/api/ai/generate-from-resume", formData, {
          headers: { authorization: token }
        });
      } else {
        toast.loading("Generating AI Questions...", { id: "generate" });
        res = await axios.post("http://localhost:5000/api/ai/generate", {
          role, difficulty, questionCount
        }, {
          headers: { authorization: token }
        });
      }

      setQuestions(res.data.questions);
      setInterviewId(res.data.interviewId);
      
      const historyRes = await axios.get("http://localhost:5000/api/interview/history", {
        headers: { authorization: token }
      });
      setHistory(historyRes.data);

      toast.success("Questions Generated Successfully", { id: "generate" });
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("AI Generation Failed", { id: "generate" });
      setLoading(false);
    }
  };

  const evaluateAnswers = async () => {
    try {
      setEvaluating(true);
      toast.loading("Evaluating Answers...", { id: "evaluate" });

      const res = await axios.post("http://localhost:5000/api/evaluate", {
        questions, answers, interviewId
      }, { headers: { authorization: token } });

      setFeedback(res.data.feedback);
      toast.success("Evaluation Complete", { id: "evaluate" });
      setEvaluating(false);
    } catch (err) {
      console.log(err);
      toast.error("Evaluation Failed", { id: "evaluate" });
      setEvaluating(false);
    }
  };

  const startNewInterview = () => {
    setQuestions("");
    setAnswers("");
    setFeedback(null);
    setInterviewId(null);
    setEvaluating(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHistory = (e) => {
    e.preventDefault();
    document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <FaRobot className="text-4xl text-blue-500" />
            <h1 className="text-2xl font-black tracking-tight text-white">Intervu<span className="text-blue-500">.ai</span></h1>
          </div>
          <nav className="space-y-4">
            <a href="#" onClick={scrollToTop} className="flex items-center gap-4 text-blue-400 bg-blue-500/10 px-4 py-3 rounded-xl font-bold transition">
              <FaHome /> Dashboard
            </a>
            <a href="#" onClick={scrollToHistory} className="flex items-center gap-4 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-xl font-bold transition">
              <FaHistory /> History
            </a>
          </nav>
        </div>
        <button 
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
          className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-red-500/20 hover:text-red-500 text-gray-400 transition p-4 rounded-xl font-bold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-5xl font-black mb-2 text-white">Welcome back,</h1>
              <p className="text-gray-400 text-xl">Let's crush your next interview.</p>
            </div>
            <button onClick={startNewInterview} className="bg-blue-600 hover:bg-blue-500 transition px-8 py-3 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              New Interview
            </button>
          </div>

          <PerformanceCharts history={history} />
          
          <InterviewGenerator onGenerate={generateQuestions} loading={loading} />

          {/* ACTIVE INTERVIEW AREA */}
          {questions && (
            <>
              {/* QUESTIONS */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-blue-400">Generated Questions</h2>
                  {!evaluating && !feedback && (
                    <Timer difficulty={activeDifficulty} onTimeout={evaluateAnswers} />
                  )}
                </div>
                
                <div className="flex gap-4 mb-6">
                  <button onClick={speakQuestions} disabled={isSpeaking} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 transition px-6 py-2 rounded-xl font-bold">
                    {isSpeaking ? "Speaking..." : "🔊 Read Aloud"}
                  </button>
                  {isSpeaking && (
                    <button onClick={stopSpeaking} className="bg-red-500 hover:bg-red-600 transition px-6 py-2 rounded-xl font-bold">
                      🛑 Stop
                    </button>
                  )}
                </div>

                <div className="bg-black border border-gray-700 p-6 rounded-2xl mb-6 shadow-inner">
                  <pre className="whitespace-pre-wrap text-lg leading-relaxed text-gray-200 font-sans">
                    {questions}
                  </pre>
                </div>
              </div>

              {/* YOUR ANSWERS & WEBCAM */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-10 text-center">
                <h2 className="text-3xl font-bold mb-6 text-green-400">Your Answers</h2>
                
                {!evaluating && !feedback && <WebcamSimulation isRecording={isRecording} />}

                <div className="flex justify-center gap-4 mb-6">
                  <button onClick={startRecording} className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-bold">
                    🎤 Start Recording
                  </button>
                  <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold">
                    🛑 Stop Recording
                  </button>
                  {isRecording && <p className="text-red-400 font-bold mb-4 animate-pulse">🎙 Listening...</p>}
                </div>

                <textarea
                  rows="12"
                  placeholder="Type your answers here..."
                  value={answers}
                  onChange={(e) => setAnswers(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-green-500"
                />

                <button
                  onClick={evaluateAnswers}
                  disabled={evaluating}
                  className="mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 transition px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  {evaluating ? "Evaluating..." : "Evaluate Answers"}
                </button>
              </div>
              
              <CodeEditor />
            </>
          )}

          {/* FEEDBACK SCORECARD */}
          {feedback && typeof feedback === "object" && (
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-10">
              <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center border-b border-gray-800 pb-6">
                AI Evaluation Scorecard
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-2xl">
                  <span className="text-gray-400 text-lg mb-2">Overall Score</span>
                  <span className="text-6xl font-black text-blue-500">{feedback.overallScore}<span className="text-3xl text-gray-500">/100</span></span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col justify-center items-center">
                    <span className="text-gray-400 text-sm">Technical</span>
                    <span className="text-2xl font-bold text-green-400">{feedback.technicalKnowledge}/10</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col justify-center items-center">
                    <span className="text-gray-400 text-sm">Communication</span>
                    <span className="text-2xl font-bold text-purple-400">{feedback.communication}/10</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col justify-center items-center">
                    <span className="text-gray-400 text-sm">Confidence</span>
                    <span className="text-2xl font-bold text-yellow-400">{feedback.confidence}/10</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col justify-center items-center">
                    <span className="text-gray-400 text-sm">Problem Solving</span>
                    <span className="text-2xl font-bold text-pink-400">{feedback.problemSolving}/10</span>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl">
                  <h3 className="text-xl font-bold text-green-400 mb-3">💪 Strengths</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl">
                  <h3 className="text-xl font-bold text-red-400 mb-3">⚠️ Weaknesses</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {feedback.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
                  <h3 className="text-xl font-bold text-blue-400 mb-3">📈 Areas to Improve</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {feedback.areasOfImprovement?.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <InterviewHistory 
            history={history} 
            onDelete={deleteInterview} 
            onDeleteAll={deleteAllInterviews} 
          />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;