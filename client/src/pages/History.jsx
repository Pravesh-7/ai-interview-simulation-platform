import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../components/layout/Sidebar";
import InterviewHistory from "../components/dashboard/InterviewHistory";

export default function History() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/interview/history", {
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

          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-20 font-bold text-xl">
              No interview history found. Go to the Dashboard to generate one!
            </div>
          ) : (
            <InterviewHistory 
              history={history} 
              onDelete={deleteInterview} 
              onDeleteAll={deleteAllInterviews} 
            />
          )}

        </div>
      </div>
    </div>
  );
}
