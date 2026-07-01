import React from "react";

export default function FeedbackScorecard({ feedback }) {
  if (!feedback || typeof feedback !== "object") return null;

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl mb-10">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center border-b border-gray-800 pb-6">
        AI Evaluation Scorecard
      </h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-2xl">
          <span className="text-gray-400 text-lg mb-2">Overall Score</span>
          <span className="text-6xl font-black text-blue-500">
            {feedback.overallScore}
            <span className="text-3xl text-gray-500">/100</span>
          </span>
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
  );
}
