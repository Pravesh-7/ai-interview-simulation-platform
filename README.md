# 🤖 AI Interview Simulation Platform

## 📖 Project Overview
An AI-powered interview preparation platform built with the **MERN Stack** and **HuggingFace / DeepSeek AI API**. It dynamically generates role-specific interview questions, evaluates candidate answers using AI, and provides scores with detailed feedback — simulating a real interview experience.

---

## 🚀 Live Demo
> Coming soon / [Add your deployed link here]

---

## 📌 Features
- 🎯 **Role-Based Question Generation** — Generates tailored interview questions based on job role (e.g., SDE, Frontend Developer, Data Analyst)
- 📄 **Resume-Based Generation** — Upload your PDF resume and have the AI generate highly personalized questions based on your actual experience
- 🎥 **Live WebRTC Camera** — Simulates a real face-to-face video interview environment by mirroring a live camera feed while you answer questions
- ⚙️ **Difficulty Levels** — Choose from Easy, Medium, or Hard to match your preparation stage
- 🔢 **Customizable Question Count** — Choose between 1 to 50 questions
- 🧠 **Structured AI Scoring** — Provides a beautiful scorecard evaluating Technical Knowledge, Communication, Confidence, and Problem Solving with Strengths & Weaknesses
- 🗣️ **Voice Features** — Speech-to-Text (Voice Answering) and Text-to-Speech (AI Reads Questions)
- 💻 **Code Editor Integration** — Write and execute real code (JS, Python, Java, C++) in the browser for technical questions using Monaco Editor & Piston
- 🧩 **Modular Architecture & Hooks** — The application frontend has been completely refactored into a scalable, component-based architecture using advanced custom hooks (`useSpeech`, `useInterviewAPI`) for maximum maintainability
- 🚀 **Visually Stunning Landing Page** — Features modern aesthetics, glassmorphism, and Framer Motion animations to create a premium first impression
- 🛡️ **Mock Data Failover** — Gracefully handles API/network failures by falling back to mock questions and feedback without hanging the UI
- 🚀 **Production Ready** — Frontend is fully configured for zero-config deployment on Vercel with dynamic environment variable routing
- ✨ **Polished UX/UI** — Updated meta tags, custom title, and clean error handling for a production-level feel
- 🔍 **Search & Filter History** — Search your past interviews by role, filter by difficulty and date, and sort by newest or oldest
- 📊 **Score & Feedback** — Provides a score and constructive feedback for each answer
- ⏱️ **Timer System** — Real-time countdown clock based on difficulty with automatic evaluation upon timeout
- 📈 **Performance Dashboard** — Visualizes total interviews, average scores, and activity trends using Recharts
- 🔐 **User Authentication** — Secure login/signup with JWT-based auth
- 📁 **Interview History & Management** — Review past interview sessions, track improvement, and delete individual or all sessions
- 🔔 **Responsive UI** — Beautifully designed UI with Toast Notifications

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, React Hot Toast, React Icons, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, Multer, pdf-parse
- **Database**: MongoDB (Mongoose)
- **AI Engine**: HuggingFace API (DeepSeek-V3-0324)
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (client), Render (server)

---

## 🏗️ Architecture
The platform is built on the **MERN** stack (MongoDB, Express, React, Node).
- The **Frontend** uses a highly modular architecture where massive stateful components are decomposed into pure presentation components (e.g., `ActiveInterview`, `FeedbackScorecard`). Complex side-effects are decoupled using custom React hooks (`useInterviewAPI`, `useSpeech`).
- The **Backend** serves as a secure proxy to the HuggingFace API (DeepSeek), parsing PDF resumes in memory using `multer` and `pdf-parse`, and storing evaluation metrics in MongoDB. 
- Graceful degradation is built into the architecture using **Mock Data Failover** mechanisms ensuring the UI never hangs if the AI provider times out.

---

## 📂 Folder Structure
```
ai-interview-simulation-platform/
├── client/                 # Frontend React (Vite) application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (dashboard, layout)
│   │   ├── hooks/          # Custom React hooks (useSpeech, useInterviewAPI)
│   │   ├── pages/          # Application views (Dashboard, History, Landing)
│   │   ├── App.jsx         # App routing
│   │   └── main.jsx        # App entry point
│   └── package.json        
└── server/                 # Backend Node.js/Express application
    ├── middleware/         # Custom Express middleware (e.g., auth)
    ├── models/             # Mongoose schemas (User, Interview)
    ├── routes/             # API endpoints (aiRoutes, authRoutes, evaluateRoutes, interviewRoutes)
    ├── server.js           # Server entry point
    └── package.json        
```

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- HuggingFace API Token (HF_TOKEN)

### 1. Clone the repository
```bash
git clone https://github.com/Pravesh-7/ai-interview-simulation-platform.git
cd ai-interview-simulation-platform
```

### 2. Setup the Server
```bash
cd server
npm install
```

### 3. Setup the Client
```bash
cd ../client
npm install
npm run dev
```

---

## 🔑 .env.example

Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_token
```

Create a `.env` file in the `/client` directory (optional for local dev, required for production):
```env
VITE_API_URL=http://localhost:5000
```

---

## 🌐 API Documentation

### Auth Routes
- **POST /api/auth/register**: Register a new user (Body: `{ name, email, password }`)
- **POST /api/auth/login**: Login and receive JWT (Body: `{ email, password }`)

### AI Routes
- **POST /api/ai/generate**: Generate interview questions (Body: `{ role, difficulty, questionCount }`)
- **POST /api/ai/generate-from-resume**: Generate from PDF (FormData: `resume`, `role`, `difficulty`, `questionCount`)
- **POST /api/evaluate**: Evaluate answers (Body: `{ questions, answers, interviewId }`)

### History Routes
- **GET /api/interview/history**: Fetch user's interview history
- **DELETE /api/interview/:id**: Delete a single interview
- **DELETE /api/interview**: Delete all interviews for the user

---

## 🗄️ Database Schema

### User
- `name` (String, Required)
- `email` (String, Required, Unique)
- `password` (String, Required)

### Interview
- `user` (ObjectId, Ref: 'User')
- `role` (String)
- `difficulty` (String)
- `questions` (String)
- `createdAt` (Date)
- `evaluation` (Object):
  - `overallScore` (Number)
  - `technicalKnowledge` (Number)
  - `communication` (Number)
  - `confidence` (Number)
  - `problemSolving` (Number)
  - `strengths` (Array of Strings)
  - `weaknesses` (Array of Strings)
  - `areasOfImprovement` (Array of Strings)

---

## 💡 Usage

1. **Register/Login** to access your personal dashboard.
2. **Configure Interview**: Select a job role, difficulty level, and number of questions. Optionally, upload a PDF resume for hyper-personalized questions.
3. **Take the Interview**: Start the live interview simulation. You can use the "Read Aloud" feature to hear the questions. Enable your webcam and use the "Start Recording" microphone button to answer using your voice, or type your answers into the text area. 
4. **Code Execution**: If asked a technical question, use the integrated Monaco Code Editor to run code (JS, Python, Java, C++) in real-time.
5. **Evaluation**: Click "Evaluate Answers" to receive a highly detailed 1-100 AI scorecard outlining your strengths and weaknesses.
6. **Review**: Navigate to the "History" tab in the sidebar to search, sort, and filter through all your past performances.

---

## 📸 Screenshots

> *(Add screenshots of your UI here — Landing Page, Dashboard, Interview Screen, Score Page)*

---

## 🚀 Deployment Guide

This project is configured for **Vercel** (Frontend) and **Render** (Backend).

### Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. Log into Vercel and click **Add New Project**.
3. Import the repository and set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `client`.
5. Under **Environment Variables**, add `VITE_API_URL` pointing to your deployed backend URL.
6. Click **Deploy**.

### Backend Deployment (Render/Heroku)
1. Deploy the `/server` folder to your provider of choice.
2. Add all environment variables from `.env.example` (`MONGO_URI`, `JWT_SECRET`, `HF_TOKEN`).

---

## 🔮 Future Enhancements

- [ ] Multi-language support (Spanish, French, etc.)
- [ ] Group interview capabilities (Mock System Design)
- [ ] Downloadable PDF export of interview report
- [ ] Leaderboard for competitive practice
- [ ] Achievements and Badges

---

## ⚠️ Known Limitations
- The accuracy of Speech-to-Text (`webkitSpeechRecognition`) relies entirely on native browser APIs (best on Chrome).
- AI generation speed is dependent on the external Gemini API latency.
- Piston code execution currently limits heavy library imports (standard libraries only).

---

## 👤 Author
**Pravesh**
- GitHub: [@Pravesh-7](https://github.com/Pravesh-7)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
