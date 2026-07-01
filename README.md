# 🤖 AI Interview Simulation Platform

An AI-powered interview preparation platform built with the **MERN Stack** and **Google Gemini API**. It dynamically generates role-specific interview questions, evaluates candidate answers using AI, and provides scores with detailed feedback — simulating a real interview experience.

---

## 🚀 Live Demo

> Coming soon / [Add your deployed link here]

---

## 📌 Features

- 🎯 **Role-Based Question Generation** — Generates tailored interview questions based on job role (e.g., SDE, Frontend Developer, Data Analyst)
- 📄 **Resume-Based Generation** — Upload your PDF resume and have the AI generate highly personalized questions based on your actual experience
- 🎥 **Live WebRTC Camera** — Simulates a real face-to-face video interview environment by mirroring a live camera feed while you answer questions
- ⚙️ **Difficulty Levels** — Choose from Easy, Medium, or Hard to match your preparation stage
- 🔢 **[NEW] Customizable Question Count** — Choose between 1 to 50 questions
- 🧠 **Structured AI Scoring** — Provides a beautiful scorecard evaluating Technical Knowledge, Communication, Confidence, and Problem Solving with Strengths & Weaknesses
- 🗣️ **Voice Features** — Speech-to-Text (Voice Answering) and Text-to-Speech (AI Reads Questions)
- 💻 **Code Editor Integration** — Write and execute real code (JS, Python, Java, C++) in the browser for technical questions using Monaco Editor & Piston
- 🧩 **Modular Architecture** — The application frontend has been completely refactored into a scalable, component-based architecture for maximum maintainability
- 🚀 **Visually Stunning Landing Page** — Features modern aesthetics, glassmorphism, and Framer Motion animations to create a premium first impression
- 🛡️ **Mock Data Failover** — Gracefully handles API/network failures by falling back to mock questions and feedback without hanging the UI
- 📊 **Score & Feedback** — Provides a score and constructive feedback for each answer
- ⏱️ **Timer System** — Real-time countdown clock based on difficulty with automatic evaluation upon timeout
- 📈 **Performance Dashboard** — Visualizes total interviews, average scores, and activity trends using Recharts
- 🔐 **User Authentication** — Secure login/signup with JWT-based auth
- 📁 **Interview History & Management** — Review past interview sessions, track improvement, and delete individual or all sessions
- 🔔 **Responsive UI** — Beautifully designed UI with Toast Notifications

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, React Hot Toast, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Google Gemini API / HuggingFace compatible APIs
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (client), Render (server)

---

## 📂 Project Structure

```
ai-interview-simulation-platform/
├── client/                 # Frontend React (Vite) application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views (e.g., Dashboard.jsx)
│   │   ├── App.jsx         # App routing
│   │   └── main.jsx        # App entry point
│   └── package.json        # Frontend dependencies
└── server/                 # Backend Node.js/Express application
    ├── middleware/         # Custom Express middleware (e.g., auth)
    ├── models/             # Mongoose schemas (User, Interview)
    ├── routes/             # API endpoints (aiRoutes, authRoutes, evaluateRoutes, interviewRoutes)
    ├── server.js           # Server entry point
    └── package.json        # Backend dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key / HF Token

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

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HF_TOKEN=your_huggingface_api_token
# or GEMINI_API_KEY=your_google_gemini_api_key
```

Run the server:
```bash
npm start
```

### 3. Setup the Client

```bash
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:5173` (or the port Vite chooses).

---

## 🧠 How It Works

1. **User selects** a job role, difficulty level, and number of questions (1-50).
2. **AI generates** tailored interview questions via the `deepseek-ai` or Gemini model.
3. **User answers** each question in the platform (via text or voice).
4. **AI evaluates** the answer for accuracy, relevance, and depth.
5. **Score + feedback** is displayed.
6. Results are saved to **MongoDB** for future reference.

---

## 🌐 API Documentation

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and receive JWT
- **GET /api/interview/history**: Fetch user's interview history
- **DELETE /api/interview/:id**: Delete a single interview
- **DELETE /api/interview**: Delete all interviews for the user
- **POST /api/ai/generate**: Generate interview questions (Body: `{ role, difficulty, questionCount }`)
- **POST /api/evaluate**: Evaluate answers (Body: `{ questions, answers }`)

---

## 🗄️ Database Schema

### User
- `name` (String)
- `email` (String, Unique)
- `password` (String)

### Interview
- `user` (ObjectId, Ref: 'User')
- `role` (String)
- `difficulty` (String)
- `questions` (String)
- `createdAt` (Date)

---

## 📸 Screenshots

> *(Add screenshots of your UI here — Home, Interview Screen, Score Page)*

---

## 🔮 Future Enhancements

- [ ] Advanced AI Scoring System & Performance Dashboard
- [ ] Resume upload for personalized question generation
- [ ] Leaderboard for competitive practice
- [ ] Downloadable PDF export of interview report
- [ ] Multi-language support
- [ ] Achievements and Badges

## ⚠️ Known Limitations
- The accuracy of speech-to-text relies on native browser APIs.
- AI generation speed is dependent on the external HuggingFace/Gemini API latency.

---

## 👤 Author

**Pravesh**
- GitHub: [@Pravesh-7](https://github.com/Pravesh-7)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
