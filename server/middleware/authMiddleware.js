const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get token from headers

        const token = req.headers.authorization;

        // Check token exists

        if (!token) {

            return res.status(401).json({
                message: "No Token Found"
            });

        }

        // Verify token

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Save user info in request

        req.user = decoded;

        next();

    } catch (err) {

        res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = authMiddleware;