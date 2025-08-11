import mongoose from "mongoose";

const ratingAndReviewsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    rating:{
        type: Number,
        required: true,
    },
    review:{
        type: String,
        trim: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
    },
});

export const  ratingAndReviewsModel = mongoose.model("RatingAndReview", ratingAndReviewsSchema);