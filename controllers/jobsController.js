import Job from "../models/jobs.js";

// Get all Jobs  =>  /api/v1/jobs
export const getJobs = async (req, res) => {
  const resPerPage = 2;
  const currentPage = Number(req.query.page) || 1;
  const skip = resPerPage * (currentPage - 1);

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const jobs = await Job.find({ ...keyword })
    .limit(resPerPage)
    .skip(skip);

  res.status(200).json({
    jobs,
  });
};

// Create a new Job   =>  /api/v1/job/new
export const newJob = async (req, res) => {
  try {
    // Adding user to body
    req.body.user = req.user.id;

    const job = await Job.create(req.body);

    res.status(200).json({
      job,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        error: "Please enter all values",
      });
    }
  }
};

// Get a single job with id and slug   =>  /api/v1/job/:id
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).json({
        error: "Please enter correct id",
      });
    }
  }
};

// Update a Job  =>  /api/v1/job/:id
export const updateJob = async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: "Job not found",
    });
  }

  // Check if the user is owner
  if (job.user.toString() !== req.user.id) {
    return res.status(401).json({
      error: "You are not allowed to update this job",
    });
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.status(200).json({
    job,
  });
};

// Delete a Job   =>  /api/v1/job/:id
export const deleteJob = async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: "Job not found",
    });
  }

  job = await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    job,
  });
};
