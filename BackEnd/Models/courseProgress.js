import mongoose from "mongoose";

const coursePorgress = new mongoose.Schema({
    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref :"SubSection"
    }],
    
});

export const CourseProgressModel = mongoose.model("CourseProgress", coursePorgress);