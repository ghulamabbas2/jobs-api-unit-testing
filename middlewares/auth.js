import jwt from "jsonwebtoken";
import User from "../models/users.js";

// Check if the user is authenticated or not
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    if (!req?.headers?.authorization?.startsWith("Bearer")) {
      return res
        .status(403)
        .json({ error: "Missing Authorization header with Bearer token" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication Failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "User authentication failed",
    });
  }
};
