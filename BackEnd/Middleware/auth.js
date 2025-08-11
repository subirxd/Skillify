import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"
import { UserModel } from "../Models/user.js"
configDotenv();

//Authentication
export async function auth(req, res, next){
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing."
            });
        }
        if (!process.env.JWT_SECRET) {

            throw new Error("JWT_SECRET is missing in .env file");
        }

        //verify token
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Data", decode);
            req.user = decode;

        } catch (error) {
            console.log("Token Verification issue", error);
            return res.status(401).json({
                success: false,
                message:"Token is invalid."
            });
        }
        //go to next middleware
        next();

    } catch (error) {
        console.log("Authentication Error", error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating token."
        });
    }
}

//isStudent
export async function isStudent(req, res, next){
    try {
        //validate data

        if (req.user.accountType !== "student") {
        return res.status(401).json({
            success: false,
            message: "Protected route for students only."
        });
    }
       //call for next middleware
       next();

    } catch (error) {
        console.log("Error while validating student route", error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again."
        });
    }
}

//isInstructor
export async function isInstructor(req, res, next) {
    try {
        //validate data
        if (req.user.accountType !== "instructor") {
        return res.status(401).json({
            success: false,
            message: "Protected route for instructor only."
        });
    }
       //call for next middleware
       next();

    } catch (error) {
        console.log("Error while validating instructor route", error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again."
        });
    }
}

//isAdmin
export async function isAdmin(req, res, next) {
    try {
        //validate data
        if (req.user.accountType !== "admin") {
        return res.status(401).json({
            success: false,
            message: "Protected route for Admin only."
        });
    }
       //call for next middleware
       next();

    } catch (error) {
        console.log("Error while validating Admin route", error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again."
        });
    }
}