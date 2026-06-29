# 🤖 AI Interview Simulation Platform

An AI-powered interview preparation platform built with the **MERN Stack** and **Google Gemini API**. It dynamically generates role-specific interview questions, evaluates candidate answers using AI, and provides scores with detailed feedback — simulating a real interview experience.

---

## 🚀 Live Demo

> Coming soon / [Add your deployed link here]

---

## 📌 Features

- 🎯 **Role-Based Question Generation** — Generates tailored interview questions based on job role (e.g., SDE, Frontend Developer, Data Analyst)
- ⚙️ **Difficulty Levels** — Choose from Easy, Medium, or Hard to match your preparation stage
- 🧠 **AI-Powered Answer Evaluation** — Evaluates responses using Google Gemini API with semantic understanding
- 📊 **Score & Feedback** — Provides a score and constructive feedback for each answer
- 🔐 **User Authentication** — Secure login/signup with JWT-based auth
- 📁 **Interview History** — Review past interview sessions and track improvement

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI Engine | Google Gemini API |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (client), Render (server) |

---

## 📂 Project Structure

```
ai-interview-simulation-platform/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   └── services/        # API call handlers
│   └── public/
├── server/                  # Express backend
│   ├── controllers/         # Business logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   └── middleware/          # Auth & error handling
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

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
GEMINI_API_KEY=your_google_gemini_api_key
```

```bash
npm run dev
```

### 3. Setup the Client

```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

---

## 🧠 How It Works

1. **User selects** a job role and difficulty level
2. **Gemini API generates** 10 tailored interview questions
3. **User answers** each question in the platform
4. **Gemini evaluates** the answer for accuracy, relevance, and depth
5. **Score + feedback** is displayed per question with an overall session score
6. Results are saved to **MongoDB** for future reference

---

## 📸 Screenshots

> *(Add screenshots of your UI here — Home, Interview Screen, Score Page)*

---

## 🔮 Future Enhancements

- [ ] Voice-based interview mode (Speech-to-Text)
- [ ] Resume upload for personalized question generation
- [ ] Leaderboard for competitive practice
- [ ] PDF export of interview report
- [ ] Multi-language support

---

## 👤 Author

**Pravesh**
- GitHub: [@Pravesh-7](https://github.com/Pravesh-7)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
