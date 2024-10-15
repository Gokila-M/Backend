import express from "express";
import { createCourse, deleteCourseById, getAllCourses, getCousreById, updateCourseById } from "../controller/course.js";


const router = express.Router();

//User routes//
router.post("/createCourse", createCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCousreById/:id", getCousreById);
router.put("/updateCourseById/:id", updateCourseById);
router.delete("/deleteCourseById/:id", deleteCourseById);



export default router;
