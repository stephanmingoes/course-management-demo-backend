import mongoose from "mongoose";
import { Semester, Status } from "../types";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    enum: Semester,
    required: true,
  },
  status: {
    type: String,
    enum: Status,
    required: true,
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecturer",
    required: true,
  },
});

export default mongoose.model("Course", CourseSchema);
