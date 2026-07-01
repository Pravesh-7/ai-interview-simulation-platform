import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../components/layout/Sidebar";
import InterviewHistory from "../components/dashboard/InterviewHistory";

export default function History() {
  const [history, setHistory] = useState([]);
  
  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const token = localStorage.getItem("token");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/interview/history`, {
        headers: { authorization: token }
      });
      setHistory(res.data);
    } catch (err) {
      console.log(err);
      toast("Failed to load history. Showing Mock History...", { icon: "⚠️" });
      setHistory([
        {
          _id: "mock1",
          role: "Mock Developer",
          difficulty: "Medium",
          questions: "1. Mock Question 1\n2. Mock Question 2",
          createdAt: new Date().toISOString(),
          evaluation: { overallScore: 85, technicalKnowledge: 8, communication: 9, confidence: 8, problemSolving: 9 }
        }
      ]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteInterview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) return;
    try {
      await axios.delete(`${API_URL}/api/interview/${id}`, { headers: { authorization: token } });
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
      await axios.delete(`${API_URL}/api/interview`, { headers: { authorization: token } });
      toast.success("All interviews deleted");
      setHistory([]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete interviews");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-5xl font-black mb-2 text-white">Your History</h1>
              <p className="text-gray-400 text-xl">Review past performances and AI feedback.</p>
            </div>
          </div>

          {/* Filters & Search */}
          {history.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Search by Role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 w-full md:w-1/3 focus:outline-none focus:border-blue-500 transition"
              />
              
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 w-full md:w-1/6 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-gray-800 text-gray-400 px-4 py-3 rounded-xl border border-gray-700 w-full md:w-1/6 focus:outline-none focus:border-blue-500 transition"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 w-full md:w-1/6 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
              </select>

              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterDifficulty("");
                  setFilterDate("");
                  setSortBy("newest");
                }}
                className="text-gray-400 hover:text-white underline w-full md:w-auto md:ml-auto"
              >
                Clear
              </button>
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-20 font-bold text-xl">
              No interview history found. Go to the Dashboard to generate one!
            </div>
          ) : (
            <>
              {(() => {
                const filteredHistory = history
                  .filter(item => {
                    const matchRole = item.role.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchDifficulty = filterDifficulty ? item.difficulty === filterDifficulty : true;
                    const matchDate = filterDate ? new Date(item.createdAt).toISOString().split('T')[0] === filterDate : true;
                    return matchRole && matchDifficulty && matchDate;
                  })
                  .sort((a, b) => {
                    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
                    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
                    return 0;
                  });

                if (filteredHistory.length === 0) {
                  return (
                    <div className="text-center text-gray-500 py-20 font-bold text-xl">
                      No matching history found for your search filters.
                    </div>
                  );
                }

                return (
                  <InterviewHistory 
                    history={filteredHistory} 
                    onDelete={deleteInterview} 
                    onDeleteAll={deleteAllInterviews} 
                  />
                );
              })()}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
