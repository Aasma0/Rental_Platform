const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or token is malformed" });
    }

    const token = authHeader.split(" ")[1]; // Get token part after 'Bearer'

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log the decoded payload (useful for debugging)
    // console.log(decoded);

    req.user = decoded.user; // Attach user info to the request

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Token is not valid or malformed" });
  }
};

module.exports = authMiddleware;
