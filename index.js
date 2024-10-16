import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import courseRoutes from "./routes/course.js"
import userRoutes from "./routes/user.js"
import discussionRoutes from "./routes/discussion.js"
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8000;
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

// Middleware
app.use(bodyParser.json()); 
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-task', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/discussion', discussionRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
