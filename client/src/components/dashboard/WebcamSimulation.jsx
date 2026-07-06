import React from 'react';
import Webcam from "react-webcam";

export default function WebcamSimulation({ isRecording }) {
  return (
    <div className="mb-8 relative rounded-2xl overflow-hidden border-4 border-gray-800 bg-black max-w-2xl mx-auto shadow-2xl">
      <Webcam 
        audio={false} 
        mirrored={true}
        className="w-full h-auto object-cover opacity-90"
        onUserMediaError={(err) => {
          console.error("Webcam Error:", err);
          alert("Camera could not be accessed! Please ensure your browser has camera permissions allowed and no other app is using it.");
        }}
      />
      {isRecording && (
        <div className="absolute top-4 right-4 bg-red-600/90 text-white font-bold px-4 py-1.5 rounded-full animate-pulse flex items-center gap-2 shadow-lg backdrop-blur-sm">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div> REC
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white font-semibold px-3 py-1 rounded-lg backdrop-blur-md text-sm">
        You (Live Feed)
      </div>
    </div>
  );
}
