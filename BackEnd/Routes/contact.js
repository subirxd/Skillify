import express from "express"
import { contactUS } from "../Controllers/contactUs.js";

const router = express.Router();

router.post("/contact", contactUS);

export default router;