import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";

export default function Timer({ difficulty, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Start timer based on difficulty
    let minutes = 15; // default easy
    const diffLower = (difficulty || "").toLowerCase();
    if (diffLower.includes("medium")) minutes = 30;
    if (diffLower.includes("hard")) minutes = 45;
    
    setTimeLeft(minutes * 60);
    setIsActive(true);
  }, [difficulty]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      toast("Time is up! Auto-submitting your answers...", { icon: '⏱️' });
      setIsActive(false);
      if (onTimeout) onTimeout();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const formatTime = (seconds) => {
    if (seconds === null) return "";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isActive || timeLeft === null) return null;

  return (
    <div className={`px-6 py-2 rounded-xl font-bold text-2xl flex items-center gap-3 ${timeLeft < 300 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-gray-800 text-yellow-400'}`}>
      ⏱️ {formatTime(timeLeft)}
    </div>
  );
}
