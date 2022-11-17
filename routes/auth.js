import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  uploadImage,
  sendEmailToUser,
  test,
} from "../controllers/authController.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/upload/image").post(uploadImage);
router.route("/email").post(sendEmailToUser);

router.route("/test").get(test);

export default router;
