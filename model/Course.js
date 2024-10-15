import mongoose from "mongoose";

// Topic Schema
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachment: {
    type: String // URL or path for attachments, if any
  }
});

// Chapter Schema
const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  topics: [topicSchema] // Array of topics within the chapter
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  chapters: [chapterSchema], // Array of chapters
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Course",courseSchema );
