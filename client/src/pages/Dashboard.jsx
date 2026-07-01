import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import {
  FaHome,
  FaHistory,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

function Dashboard() {

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [questions, setQuestions] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);  
  const [evaluating, setEvaluating] = useState(false);
  const [resume, setResume] = useState(null);
  const token = localStorage.getItem("token");

  // --- PERFORMANCE METRICS ---
  const evaluatedInterviews = history.filter(item => item.evaluation);
  const totalInterviews = history.length;
  
  const averageScore = evaluatedInterviews.length > 0 
    ? (evaluatedInterviews.reduce((acc, curr) => acc + curr.evaluation.overallScore, 0) / evaluatedInterviews.length).toFixed(1)
    : 0;
    
  const highestScore = evaluatedInterviews.length > 0
    ? Math.max(...evaluatedInterviews.map(item => item.evaluation.overallScore))
    : 0;

  const roleCounts = {};
  history.forEach(item => {
    roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
  });
  const roleData = Object.keys(roleCounts).map(key => ({ name: key, value: roleCounts[key] }));

  const diffCounts = {};
  history.forEach(item => {
    diffCounts[item.difficulty] = (diffCounts[item.difficulty] || 0) + 1;
  });
  const diffData = Object.keys(diffCounts).map(key => ({ name: key, value: diffCounts[key] }));

  const dateCounts = {};
  history.forEach(item => {
    const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });
  const activityData = Object.keys(dateCounts).map(date => ({ date, count: dateCounts[date] })).reverse().slice(-7);

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
  // ---------------------------

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/interview/history",
        {
          headers: {
            authorization: token
          }
        }
      );
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
      await axios.delete(`http://localhost:5000/api/interview/${id}`, {
        headers: { authorization: token }
      });
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
      await axios.delete(`http://localhost:5000/api/interview`, {
        headers: { authorization: token }
      });
      toast.success("All interviews deleted");
      setHistory([]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete interviews");
    }
  };

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {

    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      transcript += event.results[i][0].transcript;

    }

    setAnswers(transcript);

   };

    recognitionInstance.onend = () => {

      setIsRecording(false);

    };

    setRecognition(recognitionInstance);

  }, []);

  const generateQuestions = async () => {

    try {

      setQuestions("");
      setAnswers("");
      setFeedback(null);
      setInterviewId(null);

      setLoading(true);

      toast.loading("Generating AI Questions...", {
        id: "generate"
      });

      let res;
      
      if (resume) {
        toast.loading("Parsing Resume & Generating...", { id: "generate" });
        const formData = new FormData();
        formData.append("role", role);
        formData.append("difficulty", difficulty);
        formData.append("questionCount", questionCount);
        formData.append("resume", resume);

        res = await axios.post(
          "http://localhost:5000/api/ai/generate-from-resume",
          formData,
          {
            headers: {
              authorization: token,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      } else {
        res = await axios.post(
          "http://localhost:5000/api/ai/generate",
          {
            role,
            difficulty,
            questionCount
          },
          {
            headers: {
              authorization: token
            }
          }
        );
      }

      setQuestions(res.data.questions);
      setInterviewId(res.data.interviewId);

      const historyRes = await axios.get(
        "http://localhost:5000/api/interview/history",
        {
          headers: {
            authorization: token
          }
        }
      );

      setHistory(historyRes.data);

      toast.success("Questions Generated Successfully", {
        id: "generate"
      });

      setLoading(false);

    } catch (err) {

      console.log(err);

      toast.error("AI Generation Failed", {
        id: "generate"
      });

      setLoading(false);

    }

  };

  const startRecording = () => {

    if (!recognition) return;

    setAnswers("");

    recognition.start();

    setIsRecording(true);

  };

  const stopRecording = () => {

    if (!recognition) return;

    recognition.stop();

    setIsRecording(false);

  };

  const speakQuestions = () => {

    if (!questions) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(questions);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.onstart = () => {

    setIsSpeaking(true);

  };

  speech.onend = () => {

    setIsSpeaking(false);

  };

  window.speechSynthesis.speak(speech);

};

const stopSpeaking = () => {

  window.speechSynthesis.cancel();

  setIsSpeaking(false);

};

  const evaluateAnswers = async () => {

    try {

      setEvaluating(true);

      toast.loading("Evaluating Answers...", {
        id: "evaluate"
      });

      const res = await axios.post(
        "http://localhost:5000/api/evaluate",
        {
          questions,
          answers,
          interviewId
        },
        {
          headers: {
            authorization: token
          }
        }
      );

      setFeedback(res.data.feedback);

      toast.success("Evaluation Complete", {
        id: "evaluate"
      });

      setEvaluating(false);

    } catch (err) {

      console.log(err);

      toast.error("Evaluation Failed", {
        id: "evaluate"
      });

      setEvaluating(false);

    }

  };

  return (

    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}

      <div className="w-72 bg-gray-950 border-r border-gray-800 p-8 flex flex-col justify-between">

        <div>

          <h1 className="text-3xl font-extrabold mb-12 text-blue-500">
            AI Interview
          </h1>

          <div className="space-y-6">

            <div className="flex items-center gap-4 text-lg text-gray-300 hover:text-blue-400 transition cursor-pointer">
              <FaHome />
              <span>Dashboard</span>
            </div>

            <div className="flex items-center gap-4 text-lg text-gray-300 hover:text-blue-400 transition cursor-pointer">
              <FaRobot />
              <span>Generate Questions</span>
            </div>

            <div className="flex items-center gap-4 text-lg text-gray-300 hover:text-blue-400 transition cursor-pointer">
              <FaHistory />
              <span>Interview History</span>
            </div>

          </div>

        </div>

        <button
          onClick={() => {

            localStorage.removeItem("token");

            window.location.href = "/login";

          }}
          className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-bold"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-10 overflow-y-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-extrabold mb-3">
            AI Interview Dashboard
          </h1>

          <p className="text-gray-400 text-lg">
            Practice role-based interviews powered by AI
          </p>

        </div>

        {/* PERFORMANCE DASHBOARD */}

        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">Performance Dashboard</h2>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center">
              <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Total Interviews</h2>
              <p className="text-5xl font-black text-blue-400">{totalInterviews}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center">
              <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Average Score</h2>
              <p className="text-5xl font-black text-green-400">{averageScore}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center">
              <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Highest Score</h2>
              <p className="text-5xl font-black text-yellow-400">{highestScore}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center">
              <h2 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-2">Recent Interview</h2>
              <p className="text-xl font-bold text-purple-400 text-center truncate w-full">
                {history.length > 0 ? history[0].role : "None"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Weekly Activity Bar Chart */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl col-span-2">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-4">Weekly Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" allowDecimals={false} />
                    <RechartsTooltip cursor={{fill: '#1f2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role & Difficulty Distribution Pie Charts */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col gap-6">
              <div className="flex-1 h-32">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2 text-center">Role Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                      {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 h-32">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2 text-center">Difficulty Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={diffData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                      {diffData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Generate Interview Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Enter Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            />

            <input
              type="number"
              min="1"
              max="50"
              placeholder="Questions (1-50)"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            />

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-700">
              <label className="text-gray-400 font-bold w-1/3">📄 Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="w-2/3 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>

          </div>

          <button
            onClick={generateQuestions}
            className="mt-6 bg-blue-500 hover:bg-blue-600 transition px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            Generate Questions
          </button>

        </div>

        {/* LOADING */}

        {
          loading && (

            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-5 rounded-2xl mb-8 text-lg animate-pulse">

              Generating AI Questions...

            </div>

          )
        }

        {/* GENERATED QUESTIONS */}

        {
          questions && (

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-12">

              <h2 className="text-3xl font-bold mb-6 text-blue-400">
                Generated Questions
              </h2>
              <div className="flex gap-4 mb-6">

              <button
                  onClick={speakQuestions}
                  className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-bold"
                >
                  🔊 Read Questions
                </button>

                <button
                  onClick={stopSpeaking}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold"
                >
                  ⏹ Stop Reading
                </button>
                              {
                isSpeaking && (

                  <p className="text-purple-400 font-bold mb-5 animate-pulse">
                    🔊 AI is reading the questions...
                  </p>

                )
                }

             </div>

              <pre className="whitespace-pre-wrap text-gray-200 leading-8 text-lg">
                {questions}
              </pre>

            </div>

          )
        }

        {
          questions && (

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-10">

              <h2 className="text-3xl font-bold mb-6 text-green-400">
              Your Answers
              </h2>

              <div className="flex gap-4 mb-5">

                <button
                  onClick={startRecording}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-bold"
                >
                  🎤 Start Recording
                </button>

                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold"
                >
                  🛑 Stop Recording
                </button>

                {
                  isRecording && (

                    <p className="text-red-400 font-bold mb-4 animate-pulse">
                      🎙 Listening...
                    </p>

                  )
                }
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

          )
       }
         
     {
        feedback && typeof feedback === "object" && (

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

        )
      }

        {/* HISTORY */}

        <div className="mb-6 flex justify-between items-center">

          <h2 className="text-3xl font-bold">
            Interview History
          </h2>

          {history.length > 0 && (
            <button 
              onClick={deleteAllInterviews}
              className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded-xl font-bold"
            >
              Delete All
            </button>
          )}

        </div>

        <div className="grid gap-6">

          {
            history.map((item) => (

              <div
                key={item._id}
                className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-xl"
              >

                <div className="flex justify-between items-center mb-5">

                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-blue-400">
                      {item.role}
                    </h3>
                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
                      {item.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteInterview(item._id)}
                    className="text-red-400 hover:text-red-300 font-bold px-3 py-1 bg-gray-800 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

                {item.evaluation && (
                  <div className="mb-4 bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-gray-400 mr-2">Overall Score:</span>
                      <span className="text-2xl font-bold text-blue-400">{item.evaluation.overallScore}/100</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Tech</div>
                        <div className="font-bold text-green-400">{item.evaluation.technicalKnowledge}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Comm</div>
                        <div className="font-bold text-purple-400">{item.evaluation.communication}</div>
                      </div>
                    </div>
                  </div>
                )}

                <pre className="whitespace-pre-wrap text-gray-300 leading-8">
                  {item.questions}
                </pre>

              </div>

            ))
          }

        </div>

      </div>

    </div>

  );

}

export default Dashboard;