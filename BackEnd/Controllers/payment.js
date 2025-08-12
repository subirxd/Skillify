import mongoose from "mongoose"
import crypto from "crypto"

import instance from "../Config/razorpay.js"
import {CourseModel} from "../Models/course.js"
import {UserModel} from "../Models/user.js"
import mailSender from "../Utils/mailSender.js"
import {courseEnrollmentEmail} from '../mail/template/courseEnrollmentEmail.js'
import { paymentSuccessEmail } from "../mail/template/paymentSuccessful.js"

//initiaze the razorpay order
export const  capturePayment = async(req, res) => {
    console.log("req body",req.body);
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0){
        return res.status(200).json({
            success: false,
            message: "Please Provide CourseId"
        });
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        try {
            course = await CourseModel.findById(course_id);
            if(!course){
                return res.status(200).json({
                    success: false,
                    message: "Invalid CourseID"
                });
            }

            const uid = new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled."
                });
            }

            totalAmount += course.price;
        } catch (error) {
            console.log("Error in payment.js: ", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            data:paymentResponse,
        });
    } catch (error) {
        console.log("Error in payment response: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


//verify payment

export const verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_signature || !razorpay_order_id || !razorpay_payment_id || !courses || !userId){
        return res.status(200).json({
            success: false,
            message: "Payment failed"
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

    if(generated_signature == razorpay_signature){
        //lets enroll the student
        await enrollStudents(courses, userId, res)

        //return response
        return res.status(200).json({
            success: true,
            message:"Payment Successful."
        })
    }

    return res.status(400).json({
        success: false,
        message: "Payment Failed"
    });
}

const enrollStudents = async(courses, userId, res) => {

        if(!courses || !userId){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
            });
        }

    try {
        for(const course_id of courses){
            
            const enrolledCourse = await CourseModel.findByIdAndUpdate(course_id, 
                {$push: {studentsEnrolled: userId}}, 
                {new: true}
            )

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                })
            }

            const enrolledUser = await UserModel.
            findByIdAndUpdate(userId, 
                { $push: {courses: course_id}}
                ,{new: true}
            ).populate("courses")

            //mailsend
            const response = await mailSender(enrolledUser.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledUser.firstName + enrolledUser.lastName}`)
            )
        }

    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to purchase"
        });
    }
};


export const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await UserModel.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
};