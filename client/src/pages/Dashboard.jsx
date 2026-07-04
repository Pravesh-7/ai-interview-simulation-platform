import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import PerformanceCharts from "../components/dashboard/PerformanceCharts";
import { useInterviewAPI } from "../hooks/useInterviewAPI";

function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const { 
    history, fetchHistory 
  } = useInterviewAPI(token);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const startNewInterview = () => {
    navigate('/role-prep');
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-5xl font-black mb-2 text-white">Welcome back,</h1>
              <p className="text-gray-400 text-xl">Let's crush your next interview.</p>
            </div>
            <button onClick={startNewInterview} className="bg-blue-600 hover:bg-blue-500 transition px-8 py-3 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              New Interview
            </button>
          </div>

          <PerformanceCharts history={history} />
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;