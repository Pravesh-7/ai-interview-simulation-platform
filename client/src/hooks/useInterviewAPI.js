import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useInterviewAPI(token) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/interview/history`, {
        headers: { authorization: token }
      });
      setHistory(res.data);
    } catch (err) {
      console.log(err);
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

  const generateQuestions = async (role, difficulty, questionCount, resume, focusArea, callbacks) => {
    const { onSuccess } = callbacks;
    try {
      setLoading(true);
      let res;
      if (resume) {
        toast.loading("Parsing Resume & Generating...", { id: "generate" });
        const formData = new FormData();
        formData.append("role", role);
        formData.append("difficulty", difficulty);
        formData.append("questionCount", questionCount);
        formData.append("resume", resume);
        if (focusArea) formData.append("focusArea", focusArea);

        res = await axios.post(`${API_URL}/api/ai/generate-from-resume`, formData, {
          headers: { authorization: token }
        });
      } else {
        toast.loading("Generating AI Questions...", { id: "generate" });
        res = await axios.post(`${API_URL}/api/ai/generate`, {
          role, difficulty, questionCount
        }, {
          headers: { authorization: token }
        });
      }

      toast.success("Questions Generated Successfully", { id: "generate" });
      setLoading(false);
      
      await fetchHistory();
      
      if (onSuccess) onSuccess(res.data.questions, res.data.interviewId);
    } catch (err) {
      console.log(err);
      toast("AI Generation Failed. Falling back to Mock Data...", { icon: "⚠️", id: "generate" });
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(
          "1. Can you describe a time you overcame a challenging bug?\n2. Explain React state vs props.\n3. How do you ensure your code is maintainable?", 
          "mock_interview_" + Date.now()
        );
      }
    }
  };

  const evaluateAnswers = async (questions, answers, interviewId, callbacks) => {
    const { onSuccess } = callbacks;
    try {
      setEvaluating(true);
      toast.loading("Evaluating Answers...", { id: "evaluate" });

      const res = await axios.post(`${API_URL}/api/evaluate`, {
        questions, answers, interviewId
      }, { headers: { authorization: token } });

      toast.success("Evaluation Complete", { id: "evaluate" });
      setEvaluating(false);
      if (onSuccess) onSuccess(res.data.feedback);
    } catch (err) {
      console.log(err);
      toast("Evaluation Failed. Falling back to Mock Feedback...", { icon: "⚠️", id: "evaluate" });
      setEvaluating(false);
      if (onSuccess) {
        onSuccess({
          overallScore: 88,
          technicalKnowledge: 8,
          communication: 9,
          confidence: 9,
          problemSolving: 9,
          strengths: ["Clear structuring of thoughts", "Good foundational knowledge"],
          weaknesses: ["Could provide more specific code examples"],
          areasOfImprovement: ["Try to elaborate more on edge cases when answering technical questions."]
        });
      }
    }
  };

  return {
    history,
    loading,
    evaluating,
    fetchHistory,
    generateQuestions,
    evaluateAnswers
  };
}
