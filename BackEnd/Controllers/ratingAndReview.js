import { ratingAndReviewsModel } from "../Models/ratingAndReview.js";
import { CourseModel } from "../Models/course.js";
import { UserModel } from "../Models/user.js";
import mongoose from "mongoose";

//create rating
export async function createRatingAndReview(req, res) {
    try {
        
        //get user id,
        const uID = req.user.id;
        const userID = new mongoose.Types.ObjectId(uID);
        //fetchdata from req body
        console.log(req.body);
        const {rating, review, courseID} = req.body;
        if(!rating || !courseID){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        //verify if user is enrolled or not
        const courseDetails = await CourseModel.findOne(
                                    {   _id: courseID,
                                        studentsEnrolled: {$elemMatch: {$eq: userID}},
                                    });

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "User is not enrolled."
            });
        }
        //check if user already reviewed or not
        const alreadyReviewed = await ratingAndReviewsModel.findOne({
            user: userID,
            course: courseID
        });

        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "User is already reviewed this course."
            });
        }
        //create rating review
        const newRatingAndReview = await ratingAndReviewsModel.create({
                                                                        user: userID,
                                                                        rating, review,
                                                                        course: courseID
                                                                    });
        //update course with this rating
        const updatedCourse = await CourseModel.findByIdAndUpdate(courseID, 
                                                                {
                                                                    $push:{
                                                                        ratingAndReviews: newRatingAndReview._id,
                                                                    }
                                                                }, {new: true}
                                                            );
        //return response
        return res.status(200).json({
            success: true,
            message: "Reviewed successfully.",
            data: newRatingAndReview,
        });

    } catch (error) {
        console.log("Error while submitting rating & review: ",error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//get avg rating
export async function getAvgRating(req, res) {
    try {
        
        //getCourseID
        const {courseID} = req.body;
        if(!courseID){
            res.status(400).json({
                success: false,
                message: "CourseID needed to find average."
            });
        }
        //calculate avg rating
        const result = await ratingAndReviewsModel.aggregate([
            {
                $match:{
                    course: new mongoose.ObjectId(courseID),
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating :{$avg: "$rating"},
                }
            }
    
        ]);
        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                message:"Here is the current avg rating of the course",
                averageRating: result[0].averageRating,
            });
        }
        
        //if no rating review exist
        return res.status(200).json({
            success: true,
            message: "Avg rating is 0, no ratings given till now.",
            averageRating: 0,
        });
    } catch (error) {
        console.log("Error while fetching average rating: ",error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
};

//get all rating
export async function getAllRatingAndReviews(req, res) {
    try {
        
        const allRatingAndReview = await ratingAndReviewsModel.find({}).sort({rating: "desc"})
                                                                            .populate(
                                                                                {
                                                                                    path: "user",
                                                                                    select: "firstName  lastName email image",
                                                                                })
                                                                            .populate(
                                                                                {
                                                                                    path: "course",
                                                                                    select: "courseName",
                                                                                }).exec();
        
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully.",
            data: allRatingAndReview,
        });

    } catch (error) {
        console.log("Error while fetching all rating and reviews: ",error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
};