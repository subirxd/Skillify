import mongoose from "mongoose";
import mailSender from "../Utils/mailSender.js";
import { otpTemplate } from "../mail/template/otpTemplate.js";

const otpSchema = mongoose.Schema({
    email:{
        type: String, 
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 60 * 5,
    },
});

async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification Email From Skillify:", otpTemplate(otp));
        console.log("Email Sent SuccessFully:", mailResponse);
    } catch (error) {
        console.log("Send Verification Email Error: ",error);
        throw error;
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});
export const OTP = mongoose.model("OTP", otpSchema);