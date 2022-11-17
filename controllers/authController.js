import User from "../models/users.js";
import { getJwtToken, sendEmail } from "../utils/helpers.js";
import bcrypt from "bcryptjs";
import { S3Service } from "../utils/s3Service.js";

// Register a new user   =>   /api/v1/register
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please enter all values",
      });
    }

    password = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = await getJwtToken(user?.id);

    res.status(201).json({
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        error: "Duplicate email",
      });
    }
  }
};

// Login user  =>  /api/v1/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Checks if email or password is entered by user
    if (!email || !password) {
      return res.status(400).json({
        error: "Please enter email & Password",
      });
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid Email or Password",
      });
    }

    // Check if password is correct
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        error: "Invalid Email or Password",
      });
    }

    const token = await getJwtToken(user?.id);

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error while loggin in",
    });
  }
};

export const uploadImage = async (req, res) => {
  const s3Service = new S3Service();
  const response = await s3Service.upload(req.files.image);

  res.status(200).json({
    data: response,
  });
};

export const sendEmailToUser = async (req, res) => {
  const response = await sendEmail({
    email: "test@gmail.com",
    subject: "Password Reset",
    message: "This is test message",
  });

  res.status(200).json({
    success: true,
    response,
  });
};

export const test = async (req, res) => {
  res.status(200).json({
    test: "hello",
  });
};
