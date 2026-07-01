import React, { useState } from 'react';

import toast from "react-hot-toast";

export default function InterviewGenerator({ onGenerate, loading }) {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");

  const handleGenerate = () => {
    if (!role || !difficulty) {
      toast.error("Please enter a Role and Difficulty.");
      return;
    }
    onGenerate({ role, difficulty, questionCount });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-12">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        Setup Your Mock Interview
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Enter Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 text-white"
        />

        <input
          type="text"
          placeholder="Difficulty (e.g. Easy, Medium, Hard)"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 text-white"
        />

        <input
          type="number"
          min="1"
          max="50"
          placeholder="Questions (1-50)"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 text-white"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 transition py-4 rounded-xl font-bold text-lg shadow-lg"
      >
        {loading ? "Generating..." : "🚀 Generate Questions"}
      </button>
    </div>
  );
}
