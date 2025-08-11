import express from "express";

// Controllers
import {
  createCourse,
  getAllCourses,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
  searchCourse,
  markLectureAsComplete,
  getCourseDetails,
} from "../Controllers/course.js";

import {
  showAllCategory,
  createCategory,
  categoryPageDetails,
  addCourseToCategory,
} from "../Controllers/category.js";

import {
  createSection,
  updateSection,
  deleteSection,
} from "../Controllers/section.js";

import {
  createSubSection,
  deleteSubSection,
  updateSubSection,
} from "../Controllers/subSection.js";

import {
  createRatingAndReview,
  getAvgRating,
  getAllRatingAndReviews,
} from "../Controllers/ratingAndReview.js";

// Middleware
import { auth, isAdmin, isInstructor, isStudent } from "../Middleware/auth.js";

const router = express.Router();

// -------------------- COURSE ROUTES -------------------- //
router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseDetails/:courseId", getCourseDetails);
router.put("/editCourse", auth, isInstructor, editCourse);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.get("/getFullCourseDetails", auth, getFullCourseDetails);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
router.get("/searchCourse", searchCourse); // GET is preferred for search queries
router.patch("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

// -------------------- SECTION ROUTES -------------------- //
router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection/:sectionId", auth, isInstructor, deleteSection);

// -------------------- SUB-SECTION ROUTES -------------------- //
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

// -------------------- CATEGORY ROUTES -------------------- //
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

// -------------------- RATING AND REVIEW ROUTES -------------------- //
router.post("/createRating", auth, isStudent, createRatingAndReview);
router.get("/getAverageRating", getAvgRating);
router.get("/getReviews", getAllRatingAndReviews);

export default router;
