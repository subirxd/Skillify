import express from "express";
import { configDotenv } from "dotenv";
import { connect } from "./Config/database.js";
import cookieParser from "cookie-parser";
import { cloudinaryConnect } from "./Config/cloudinary.js";
import cors from "cors";
import fileUpload from "express-fileupload";

import contactUSRoutes from "../BackEnd/Routes/contact.js";
import profileRoutes from "../BackEnd/Routes/profile.js";
import paymentRoutes from "../BackEnd/Routes/payments.js";
import courseRoutes from "../BackEnd/Routes/course.js";
import userRoutes from "../BackEnd/Routes/user.js";

configDotenv();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
     origin: ["http://192.168.0.176:3000", "http://localhost:3000"],
    credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp",
    })
);

connect();
cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contactus", contactUSRoutes);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Your server is up and running"
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT}`);
});


