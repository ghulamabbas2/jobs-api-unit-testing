import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter Job title."],
    trim: true,
    maxlength: [100, "Job title can not exceed 100 characters."],
  },
  description: {
    type: String,
    required: [true, "Please enter Job description."],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
  },
  address: {
    type: String,
    required: [true, "Please add an address."],
  },
  company: {
    type: String,
    required: [true, "Please add Company name."],
  },
  industry: {
    type: [String],
    required: [true, "Please enter industry for this job."],
    enum: {
      values: [
        "Business",
        "Information Technology",
        "Banking",
        "Education/Training",
        "Telecommunication",
        "Others",
      ],
      message: "Please select correct options for industry.",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  salary: {
    type: Number,
    required: [true, "Please enter expected salary for this job."],
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Job", jobSchema);
