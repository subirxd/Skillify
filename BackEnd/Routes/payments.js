import express from "express"


import { capturePayment, sendPaymentSuccessEmail } from "../Controllers/payment.js";
import { verifyPayment } from "../Controllers/payment.js";
import { auth, isStudent } from "../Middleware/auth.js";

const router = express.Router();

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent,  verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent,  sendPaymentSuccessEmail);

export default router;