const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    // Decode the token to get user data
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user has an admin role
    if (req.user.role === "admin") {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
