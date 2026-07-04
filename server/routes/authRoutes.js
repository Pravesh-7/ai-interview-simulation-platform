const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// REGISTER ROUTE

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields: name, email, and password." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: "User Registered",
            user: userResponse
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


// LOGIN ROUTE

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find User

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            });

        }

        // Compare Password

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Password"
            });

        }

        // Generate JWT Token

        const token = jwt.sign(

            { id: user._id },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );

        res.json({

            message: "Login Successful",
            token

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


module.exports = router;