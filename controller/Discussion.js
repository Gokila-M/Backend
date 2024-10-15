
import Discussion from "../model/Discussion.js"

// Create a new discussion
export const createDiscussion = async (req, res) => {
  const { title, content, course } = req.body;

  try {
    const discussion = new Discussion({
      title,
      content,
      course,
      createdBy: req.user._id, 
    });

    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all discussions for a specific course
export const getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({ course: req.params.courseId }).populate('createdBy', 'name email');
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single discussion by ID
export const getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('comments.createdBy', 'name email');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a discussion by ID
export const updateDiscussion = async (req, res) => {
  const { title, content } = req.body;

  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a discussion by ID
export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndDelete(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a discussion
export const addComment = async (req, res) => {
  const { content } = req.body;

  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = {
      content,
      createdBy: req.user._id, 
    };

    discussion.comments.push(comment);
    await discussion.save();

    res.status(201).json(discussion); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Like or unlike a discussion
export const likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user has already liked the discussion
    const index = discussion.likes.indexOf(req.user._id);
    if (index === -1) {
      // User has not liked the discussion, so add their ID
      discussion.likes.push(req.user._id);
    } else {
      // User has already liked the discussion, so remove their ID
      discussion.likes.splice(index, 1);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
