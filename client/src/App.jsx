import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumePrep from "./pages/ResumePrep";
import Landing from "./pages/Landing";
import History from "./pages/History";
import InterviewPage from "./pages/InterviewPage";
import RolePrep from "./pages/RolePrep";

function App() {

  const token = localStorage.getItem("token");

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            token ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/resume-prep"
          element={
            token ? <ResumePrep /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/role-prep"
          element={
            token ? <RolePrep /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/history"
          element={
            token ? <History /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/interview"
          element={
            token ? <InterviewPage /> : <Navigate to="/login" />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;