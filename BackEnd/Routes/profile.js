import express from "express";

// Middleware
import { auth, isInstructor, isStudent } from "../Middleware/auth.js";

// Controllers
import {
  deleteProfile,
  updateProfile,
  getUserDetails,
  updateDisplayPicture,
  instructorDashboard,
  getEnrolledCourse,
} from "../Controllers/profile.js";

const router = express.Router();

// -------------------- USER PROFILE ROUTES -------------------- //

// Protected user routes
router.get("/getUserDetails", auth, getUserDetails);      // Get logged-in user info
router.put("/updateProfile", auth, updateProfile);           // Update user profile
router.put("/updateDisplayPicture", auth, updateDisplayPicture); // Change profile picture
router.delete("/deleteProfile", auth, isStudent,  deleteProfile);        // Delete user account

// -------------------- COURSE PROGRESS -------------------- //

router.get("/getEnrolledCourses", auth, isStudent,  getEnrolledCourse);  // Get all enrolled courses for student

// -------------------- INSTRUCTOR DASHBOARD -------------------- //

router.get(
  "/getInstructorDashboardDetails",
  auth,
  isInstructor,
  instructorDashboard
); // Get instructor stats & analytics

export default router;
