import React, { useState } from "react";
import Timer from "./Timer";
import WebcamSimulation from "./WebcamSimulation";
import CodeEditor from "./CodeEditor";

export default function ActiveInterview({
  questions,
  answers,
  setAnswers,
  evaluating,
  feedback,
  activeDifficulty,
  evaluateAnswers,
  isRecording,
  isSpeaking,
  startRecording,
  stopRecording,
  speakQuestions,
  stopSpeaking
}) {
  const [useVideo, setUseVideo] = useState(true);

  if (!questions) return null;

  return (
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
          <button onClick={() => speakQuestions(questions)} disabled={isSpeaking} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 transition px-6 py-2 rounded-xl font-bold">
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
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-green-400">Your Answers</h2>
          
          <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl">
            <button 
              onClick={() => setUseVideo(true)}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${useVideo ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              🎥 Video Mode
            </button>
            <button 
              onClick={() => setUseVideo(false)}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${!useVideo ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              🎙️ Audio Only
            </button>
          </div>
        </div>
        
        {!evaluating && !feedback && useVideo && <WebcamSimulation isRecording={isRecording} />}

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
  );
}
