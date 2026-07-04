import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import InterviewGenerator from "../components/dashboard/InterviewGenerator";
import { useInterviewAPI } from "../hooks/useInterviewAPI";

function RolePrep() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const { 
    loading, generateQuestions 
  } = useInterviewAPI(token);

  const handleGenerate = (params) => {
    const { role, difficulty, questionCount, resume } = params;
    
    generateQuestions(role, difficulty, questionCount, resume, null, {
      onSuccess: (generatedQuestions, id) => {
        navigate('/interview', {
          state: {
            questions: generatedQuestions,
            interviewId: id,
            activeDifficulty: difficulty
          }
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div>
              <h1 className="text-5xl font-black mb-2 text-white">Role Based Setup</h1>
              <p className="text-gray-400 text-xl">Configure your mock interview parameters.</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gray-800 hover:bg-gray-700 transition px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
          
          <div id="setup-section" className="scroll-mt-8">
            <InterviewGenerator onGenerate={handleGenerate} loading={loading} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default RolePrep;
