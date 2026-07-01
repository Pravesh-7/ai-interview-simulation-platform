import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRobot, FaHome, FaHistory, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <FaRobot className="text-4xl text-blue-500" />
          <h1 className="text-2xl font-black tracking-tight text-white">
            Intervu<span className="text-blue-500">.ai</span>
          </h1>
        </div>
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition ${
              isActive("/dashboard")
                ? "text-blue-400 bg-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaHome /> Dashboard
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition ${
              isActive("/history")
                ? "text-blue-400 bg-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaHistory /> History
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-red-500/20 hover:text-red-500 text-gray-400 transition p-4 rounded-xl font-bold"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
