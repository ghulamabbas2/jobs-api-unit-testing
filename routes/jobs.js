import express from "express";
const router = express.Router();

// Importing jobs controller methods
import {
  getJobs,
  getJob,
  newJob,
  updateJob,
  deleteJob,
} from "../controllers/jobsController.js";

import { isAuthenticatedUser } from "../middlewares/auth.js";

router.route("/jobs").get(getJobs);
router.route("/job/:id").get(getJob);

router.route("/job/new").post(isAuthenticatedUser, newJob);

router
  .route("/job/:id")
  .put(isAuthenticatedUser, updateJob)
  .delete(isAuthenticatedUser, deleteJob);

export default router;
