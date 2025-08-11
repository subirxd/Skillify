import { ProfileModel } from "../Models/profile.js";
import { UserModel } from "../Models/user.js";
import { CourseModel } from "../Models/course.js";
import { CourseProgressModel } from "../Models/courseProgress.js";
import { uploadImageToCloudinary } from "../Utils/imageUploader.js";

export async function updateProfile(req, res) {
    try {
        
        //fetch data and userId ->> using userId fetch profileID
        const{gender, dateOfBirth, about, contactNumber, firstName, lastName} = req.body;
        const userId = req.user.id;
        //validate data
        if(!gender || !dateOfBirth){
            return res.status(400).json({
                success: false,
                message:"All fields are required."
            });
        };
        
        //find profile
        const userDetails = await UserModel.findById(userId);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await ProfileModel.findById(profileId);

        //update the profileDB
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        if(contactNumber) profileDetails.contactNumber = contactNumber;
       

        //save the details into the DB
        await profileDetails.save();
         const user = await UserModel.findByIdAndUpdate(userId, {
            firstName,
            lastName,
        }, {new: true, runValidators: true}).populate("additionalDetails");

        user.password = undefined;
        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: user,
        });

    } catch (error) {
        console.log("Error while updating profile: ", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later.",
            error: error.message,
        });
    };
};

//detele profile controller
export async function deleteProfile(req, res) {
    try {
        
        //get id
        const userId = req.user.id;
        //validate_id
        const userDetail = await UserModel.findById(userId);
        if(!userDetail){
            return res.status(404).json({
                success: false,
                message:"User not found."
            });
        }
        
        //unenroll user from all enrolled courses.
        const enrolledCourses = userDetail.courses;
        for(const courseID of enrolledCourses){
            await CourseModel.findByIdAndUpdate({_id: courseID}, {$pull:{studentsEnrolled: userId}});
        };

        await CourseProgressModel.deleteMany({userID: userId});

        //delete profile
        await ProfileModel.findByIdAndDelete({_id: userDetail.additionalDetails});
        

        //delete user
        await UserModel.findByIdAndDelete(userId);

        //return response
        return res.status(200).json({
            success: true,
            message:"User deleted successfully."
        });

    } catch (error) {
        console.log("Error while deleting profile: ", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later.",
            error: error.message,
        });
    }
};

export async function getUserDetails(req, res) {
    try {
        
        const userId = req.user.id;

        const userDetail = await UserModel.findById(userId).populate("additionalDetails").exec();
        if (!userDetail) {
            return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }
        return res.status(200).json({
            success: true,
            message:"User data fetch successfully.",
            data: userDetail,
        });

    } catch (error) {
        console.log("Error while fetching profile details: ", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later.",
            error: error.message,
        });
    }
};

export async function updateDisplayPicture(req, res) {
    try {
        
        const userId = req.user.id;
        const user = await UserModel.findById(userId).populate("additionalDetails");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const profilePic = req.files.displayPicture;
        console.log("Profile Picture", profilePic);

        if(!profilePic){
            return res.status(400).json({
                success: false,
                message: "Image not found."
            });
        }

        console.log("Going to upload image");
        const uploadedDetails = await uploadImageToCloudinary(profilePic, process.env.FOLDER_NAME);
        console.log("Came back from uplaod");
        user.image = uploadedDetails.secure_url;
        await user.save();
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully.",
            data: user
        });
    } catch (error) {
        console.log("Error while changing profile picture:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later.",
            error: error.message,
        });
    }
};

export async function instructorDashboard(req, res) {
    try {
        
        const userID = req.user.id;

        const courseData = await CourseModel.find({instructor: userID});

        const allCourseDetails = courseData.map((course) => {
            const totalStudents = course?.studentsEnrolled?.length;
            const totalRevenue = course?.price * totalStudents;

            const courseStats = {
                _id: course._id,
                courseName : course.courseName,
                courseDescription: course.courseDescription,
                totalStudents,
                totalRevenue,
            };
            return courseStats;
        });

        res.status(200).json({
            success: true,
            message:"User data fetched successfully.",
            data: allCourseDetails,
        });
    } catch (error) {
        console.log("Error while fetching instructor dashboard:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export async function getEnrolledCourse(req, res) {
    try {
        const userID = req.user.id;

        const enrolledCourses = await UserModel.findById(userID).
                                                populate({
                                                    path:"courses",
                                                    populate: {
                                                        path:"courseContent",
                                                        populate: "subSection",
                                                    }
                                                }).
                                                populate("courseProgress").
                                                exec();
        
                                                
        if(!enrolledCourses){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        enrolledCourses.password = undefined;
        
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully.",
            data: enrolledCourses,
        });
    } catch (error) {
        console.log("Error in getEnrolled function:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};