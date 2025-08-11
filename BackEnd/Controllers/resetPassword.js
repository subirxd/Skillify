import { UserModel } from "../Models/user.js";
import mailSender from "../Utils/mailSender.js";
import bcrypt from "bcrypt"
import { passwordUpdated } from "../mail/template/passwordUpdate.js";


//resetPassword Token
export async function resetPasswordToken(req, res) {
    try {
        //fetch email
        const {email} = req.body;
        //validate email
        if(!email){
            return res.status(403).json({
                success: false,
                message:"Email is requird to reset password."
            });
        }
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "No registered user, using this email."
            });
        }

        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await UserModel.findOneAndUpdate({email}, 
                                                                {token: token, 
                                                                resetPasswordExpires: Date.now() + 5*60*1000,
                                                                },
                                                                {new: true}
                                                                );
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailSender(email, "Reset Password from Skillify", 
                        `Password Reset Link: ${url}`
        );
        //return response
        return res.status(200).json({
            success: true,
            message:"Email sent successfully, check inobx and reset your password."
        });
    } catch (error) {
        console.log("Error in Reset password Token generation", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later."
        });
    }
}


//resetPassword
export async function resetPassword(req, res) {
    try {
        const {password, confirmPassword, token} = req.body;

        //validation
        if(!token || !password || !confirmPassword){
            return res.status(406).json({
                success: false,
                message: "All fields are required to reset password"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match."
            });
        }

        //get use deatils from db using token
        const userDetails = await UserModel.findOne({token});

        //if no entry -- invalid token
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Time expired, Please try again."
            });
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            userDetails.token = undefined;
            userDetails.resetPasswordExpires = undefined;
            return res.status(400).json({
                success: false,
                message: "Token is expired."
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password in db
        const updatedPassword = await UserModel.findOneAndUpdate({token}, 
                                                                {password: hashedPassword,
                                                                },
                                                                {new: true}
        );

        //delete token and time from DB, and save the changes
        updatedPassword.token = undefined;
        updatedPassword.resetPasswordExpires = undefined;

        await updatedPassword.save();
        //send a mail to user
        await mailSender(userDetails.email, "Password Reset", passwordUpdated(userDetails.email, `${userDetails.firstName + userDetails.lastName}`));
        //return response
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully."
        })
    } catch (error) {
        console.log("Error in reset password", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later"
        });
    }
}