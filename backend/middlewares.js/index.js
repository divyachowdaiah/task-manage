const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config(); // Ensure environment variables are loaded

exports.verifyAccessToken = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(400).json({ status: false, msg: "Token not found" });
  }

  // Extract token if "Bearer <token>" format is used
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
