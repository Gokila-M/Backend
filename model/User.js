import bcrypt from 'bcryptjs/dist/bcrypt.js';
import mongoose from 'mongoose';


// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String // Store Google OAuth ID if logged in via Google
  },
  githubId: {
    type: String // Store GitHub OAuth ID if logged in via GitHub
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare the given password with the stored hash
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User",userSchema );