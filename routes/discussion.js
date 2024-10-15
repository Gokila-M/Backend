import express from 'express';
import { addComment, createDiscussion, deleteDiscussion, getAllDiscussions, getDiscussionById, likeDiscussion, updateDiscussion } from '../controller/Discussion.js';
import { protect } from '../middleware/auth.js';



const router = express.Router();

// Create a new discussion 
router.post('/createDiscussion', protect, createDiscussion);

// Get all discussions for a specific course 
router.get('/getalldiscussion/:courseId', protect, getAllDiscussions);

// Get a single discussion by ID 
router.get('/discussionById/:id', protect, getDiscussionById);

// Update a discussion by ID 
router.put('/updatediscussion/:id', protect, updateDiscussion);

// Delete a discussion by ID 
router.delete('/deletediscussion/:id', protect, deleteDiscussion);

// Add a comment to a discussion 
router.post('/:id/addcomment', protect, addComment);

// Like or unlike a discussion 
router.put('/:id/likeorunlike', protect, likeDiscussion);

export default router;
