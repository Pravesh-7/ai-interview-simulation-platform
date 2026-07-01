import React, { useState } from 'react';
import toast from "react-hot-toast";

export default function ResumeGenerator({ onGenerate, loading }) {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [resume, setResume] = useState(null);
  const [focusArea, setFocusArea] = useState("All");

  const handleGenerate = () => {
    if (!role || !difficulty) {
      toast.error("Please enter a Role and Difficulty.");
      return;
    }
    if (!resume) {
      toast.error("Please upload a Resume.");
      return;
    }
    onGenerate({ role, difficulty, questionCount, resume, focusArea });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-12">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">
        Resume-Based Interview
      </h2>
      <p className="text-gray-400 mb-8">
        Upload your resume and the AI will generate questions specifically targeted to your background.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Target Role (e.g. SDE)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 text-white"
        />

        <input
          type="text"
          placeholder="Difficulty (Easy, Medium, Hard)"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 text-white"
        />

        <input
          type="number"
          min="1"
          max="50"
          placeholder="Questions (1-50)"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 text-white"
        />

        <select
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className="p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-purple-500 text-white"
        >
          <option value="All">Focus Area: All</option>
          <option value="Projects">Focus Area: Projects Only</option>
          <option value="Tech Stack">Focus Area: Tech Stack Only</option>
          <option value="Work Experience">Focus Area: Work Experience Only</option>
        </select>

        <div className="md:col-span-2 flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-700">
          <label className="text-gray-400 font-bold w-1/3">📄 Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-2/3 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 transition py-4 rounded-xl font-bold text-lg shadow-lg text-white"
      >
        {loading ? "Parsing Resume & Generating..." : "🚀 Generate Resume Questions"}
      </button>
    </div>
  );
}
