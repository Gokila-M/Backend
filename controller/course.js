
import express from 'express';
import course from '../model/course.js';






// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, duration, category, chapters,createdBy } = req.body;
    const coursereg = new course({
      title,
      description,
      duration,
      category,
      chapters,
      createdBy
    });
    await coursereg.save();
    res.status(201).json(coursereg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses with pagination
export const getAllCourses=  async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const courses = await course.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await course.countDocuments();
    res.json({
      courses,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific course by ID
export const getCousreById= async (req, res) => {
  try {
    const coursedata = await course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(coursedata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course by ID
// export const updateCourseById = async (req, res) => {
//   try {
//     const { title, description, duration, category, chapters,createdBy } = req.body;
//     const updatecourse = await course.findByIdAndUpdate(
//       req.params.id,
//       { title, description, duration, category, chapters,createdBy }
//     );
//     if (!updatecourse) return res.status(404).json({ message: 'Course not found' });
//     res.json(updatecourse);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// Update Course by ID
export const updateCourseById = async (req, res) => {
  const { title, description, duration, category, chapters } = req.body;

  try {
    // Find the course by ID and update its details
    const updatedCourse = await course.findByIdAndUpdate(
      req.params.id, // Get the course ID from the URL parameters
      {
        title,
        description, 
        duration,
        category,
        chapters,
      },
      { new: true, runValidators: true } // Return the updated course document
    ).populate('createdBy', 'name email'); // Populate createdBy field with user data

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse); // Return the updated course data
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle validation errors
  }
};


// Delete a course by ID
export const deleteCourseById= async (req, res) => {
  try {
    const course = await course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


