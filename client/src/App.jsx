import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumePrep from "./pages/ResumePrep";
import Landing from "./pages/Landing";
import History from "./pages/History";
import InterviewPage from "./pages/InterviewPage";
import RolePrep from "./pages/RolePrep";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }
        />

        <Route
          path="/resume-prep"
          element={
            <ProtectedRoute><ResumePrep /></ProtectedRoute>
          }
        />

        <Route
          path="/role-prep"
          element={
            <ProtectedRoute><RolePrep /></ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute><History /></ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute><InterviewPage /></ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;