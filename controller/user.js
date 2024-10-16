
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";


dotenv.config(); 

// Generate JWT Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '55m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// User Registration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({ name, email, password });
    await user.save();

    // Generate JWT tokens
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json({ user, ...tokens });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
export const loginUser  = async (req, res) => {
  // console.log(JWT_REFRESH_SECRET,JWT_SECRET,"env values");
  
    const { email, password } = req.body;
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare the password 
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT tokens
      const tokens = generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();
  
      res.json({ user, ...tokens });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Refresh JWT Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Logout User (Single Device)
export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Invalidate refresh token
    user.refreshToken = null;
    await user.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth 
export const googleOAuthCallback = async (req, res) => {
  const { googleId, email, name } = req.user; 
  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({ googleId, email, name });
      await user.save();
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({ user, ...tokens });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // Using req.user._id from the protect middleware (authenticated user)
      {
        name: req.body.name,
        email: req.body.email,
        // Add more fields if needed
      },
      {  runValidators: true } // Return the updated user document
    ).select('-password'); // Exclude the password field

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser); // Return updated user info
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.params.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Return user data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Find all users, exclude passwords for security
    const users = await User.find().select('-password');
    res.json(users); // Return all users
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the logged-in user's profile
 export const getProfile = async (req, res) => {
  try {
    // req.user is already populated by the protect middleware
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



