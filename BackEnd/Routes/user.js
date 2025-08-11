import express from "express";

// Auth Controllers
import { login, signUp, sendOTP, changePassword } from "../Controllers/auth.js";
import { resetPassword, resetPasswordToken } from "../Controllers/resetPassword.js";

// Middleware
import { auth } from "../Middleware/auth.js";

const router = express.Router();

// -------------------- AUTH ROUTES -------------------- //

router.post("/signup", signUp);                    // Register new user
router.post("/login", login);                      // Login existing user
router.post("/send-otp", sendOTP);                 // Send OTP for email verification

// Password reset
router.post("/reset-password-token", resetPasswordToken);  // Request password reset token
router.post("/reset-password", resetPassword);             // Reset password using token

// Protected routes
router.post("/change-password", auth, changePassword);     // Change password (logged-in users only)

export default router;
