require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.get("/api/protected", authMiddleware, (req, res) => {

    res.json({
        message: "Protected Route Accessed",
        user: req.user
    });

});

app.listen(5000, () => {
    console.log("Server Started");
});