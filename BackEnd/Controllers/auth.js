import { UserModel } from "../Models/user.js";
import { OTP } from "../Models/otp.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt"
import { ProfileModel } from "../Models/profile.js";
import jwt from "jsonwebtoken"
import {config, configDotenv} from "dotenv"
import mailSender from "../utils/mailSender.js";
configDotenv();

//sendOTP
export async function sendOTP(req, res){
    try {
        //fetch email from req body
        const email = req.body.email;
        console.log(email);
        //check if user already exist
        const checkUserPresent = await UserModel.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User Already Registered",
            });
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP generated", otp);

        //check unique OTP or not
        const uniqueOTP = await OTP.findOne({otp});
        while(uniqueOTP){
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,

            });
        uniqueOTP = await OTP.findOne({otp});
        }

       //create an entry in DB for OTP
       const otpPayload = {email, otp};
       const otpBody = await OTP.create(otpPayload);
       console.log(otpBody);

       //return success
        return res.status(200).json({
        success: true,
        message: "OTP Sent Successfully."
       });

    } catch (error) {
        console.log("Send OTP Error: ",error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

//signup
export async function signUp(req, res){
    try {
        //data fetch
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;
        //validate data

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required."
            });
        }

        const normalizedAccountType = accountType.toLowerCase();

        //2 password match
        if(confirmPassword !== password){
            return res.status(400).json({
                success: false,
                message: "Passwords don't match."
            });
        }

        //check userAlready exist
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already registered."
            });
        }

        //find most recent otp for the user
        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("Recent OTP", recentOTP);

        //validate otp
        if(recentOTP.length === 0){
            return res.status(400).json({
                success: false,
                message: "Time Expired, please try again."
            });
        }
        else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP Entered."
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //entry create into DB
        const profileDetails = await ProfileModel.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber,
        });

        const user = await UserModel.create({
            firstName, 
            lastName, 
            email, 
            contactNumber, 
            password: hashedPassword, 
            accountType: normalizedAccountType, 
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        //return success response
        return res.status(200).json({
            success: true,
            message: "User profile created successfully."
        });

    } catch (error) {
        console.log("SignUp Error: ",error);

       return res.status(500).json({
        success: false,
        message: "Something went wrong, Please try again later."
       });
    }
}

//login
export async function login(req, res){
    try {
        const {email, password} = req.body;

        //data validation
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are required, please try again."
            })
        }
        //check userFound or not
        const user = await UserModel.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                message:"User not registered, Please SignUp."
            });
        }

        //check password matching
        if(await bcrypt.compare(password, user.password)){
            //if password matched, then make a token and store it inside "user"
            const payload = {
                email : user.email,
                id: user._id,
                accountType: user.accountType,
            }

            if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in .env file");
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"3d"
            });

            user.token = token;
            user.password = undefined;
            //create cookie and store the data into it
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully."
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Incorrect Password."
            });
        }

        
    } catch (error) {
        console.log("Error While Login", error);
        return res.status(500).json({
            success: false,
            message: "Failed to login, Please try again later."
        });
    }
}

//changePassword

export async function changePassword(req, res){
    try {
        //get data from req body
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const {email} = req.user;

        //validation
        if(!email || !oldPassword || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success: false,
                message: "All fields are required, Please try again."
            });
        }

        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(404).json({
            success: false,
            message: "User not found.",
            });
        }
        //check if oldPass is matching
        if(await bcrypt.compare(oldPassword, user.password)){

            if(newPassword !== confirmNewPassword){
                return res.status(401).json({
                    success: false,
                    message: "New password and confirm password do not match."
                });
            }
            //update password in databse
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedPassword = await UserModel.findOneAndUpdate({email}, {password: hashedPassword}, {new: true});
            // Send password update email
            try {
            const mailResponse = await mailSender(
                email,
                "Password Update",
                "Your Skillify password has been updated."
            );
            console.log("Password Updated Mail sent successfully", mailResponse);
            } catch (error) {
            console.log("Password Update mail error:", error);
            }


            //return response
            return res.status(200).json({
                success: true,
                message: "Password Updated Successfully."
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect."
            })
        }
        
    } catch (error) {
        console.log("Password Update Error", error);
        return res.status(500).json({
            success: false,
            message: "Can't update password now, Please try again later."
        });
    }
}