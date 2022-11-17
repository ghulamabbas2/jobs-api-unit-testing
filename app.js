import express from "express";
const app = express();

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

// Setup body parser
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

app.use(fileUpload());

// Importing all routes
import auth from "./routes/auth.js";
import jobs from "./routes/jobs.js";

app.use("/api/v1", auth);
app.use("/api/v1", jobs);

// Handle unhandled routes
app.all("*", (req, res) => {
  return res.status(404).json({
    error: `Route not found`,
  });
});

export default app;
