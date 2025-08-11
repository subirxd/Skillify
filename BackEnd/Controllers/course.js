import { CourseModel } from "../Models/course.js";
import { CategoryModel } from "../Models/category.js";
import { UserModel } from "../Models/user.js";
import { CourseProgressModel } from "../Models/courseProgress.js";
import { SectionModel } from "../Models/section.js";
import { SubSectionModel } from "../Models/subSection.js";
import { uploadImageToCloudinary } from "../Utils/imageUploader.js";
import { convertSecondsToDuration } from "../Utils/secToDuration.js";

//create a course
export async function createCourse(req, res) {
    try {
        
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, category, tag, status, instructions} = req.body;
        
        //get Thumbnail
        const thumbnail = req.files.thumbnailImage;
        

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price ||!category || !thumbnail || !instructions){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (!status || status === undefined) {
        status = "Draft"
        }

        //check for instructor_id
        const userId = req.user.id;
        const instructorDetails = await UserModel.findById(userId);
        

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message:"Instructor details not found."
            });
        }
        

        //check given tag is valid or not
        const categoryDetails = await CategoryModel.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message:"Tag details not found."
            });
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for newCourse
        const newCourse = await CourseModel.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            tag:tag,
            status: status,
            instructions: instructions
        });

        //add the new course to the user schema of user schema of instructor
        await UserModel.findByIdAndUpdate({_id: instructorDetails._id}, 
                                        {
                                            $push: {
                                                courses: newCourse._id,
                                            }
                                        },
                                        {new: true}
        );

        //update the tag schema
        await CategoryModel.findByIdAndUpdate({_id: categoryDetails._id},
                                            {
                                                $push:{
                                                    courses: newCourse._id,
                                                }
                                            },
                                            {new: true}
        );

        //return response
        return res.status(200).json({
            success: true,
            message:"Course Created Successfully.",
            course: newCourse,
        });

    } catch (error) {
        console.log("Error While Creating Course: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course.",
            error: error.message,
        });
    }
}


//get all courses
export async function getAllCourses(req, res) {
    try {
        const allCourses = await CourseModel.find({}, {courseName: true, 
                                                        price: true,
                                                        thumbnail: true,
                                                        instructor: true,
                                                        ratingAndReviews: true,
                                                        studentsEnrolled: true,
                                                        status: true,

        }).populate("instructor").exec();

        const allCoursesData = allCourses.map((course) => {
        const obj = course.toObject();
        if (obj.instructor?.password) {
            obj.instructor.password = undefined;
        }
        return obj;
        });

        return res.status(200).json({
            success: true,
            message:"All course fetched successfully.",
            data: allCoursesData,
        });

    } catch (error) {
        console.log("Error while fetching course: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course.",
            error: error.message,
        });
    }
};


export async function getCourseDetails(req, res) {
    try {
        const {courseId} = req.params;
        const courseDetails=await CourseModel.find({_id: courseId}).populate({path:"instructor",
        populate:{path:"additionalDetails"}})
        .populate("category")
        .populate({                    //only populate user name and image
            path:"ratingAndReviews",
            populate:{path:"user"
            ,select:"firstName lastName accountType image"}
        })
        .populate({path:"courseContent",populate:{path:"subSection"}})
        .exec();

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course Not Found."
            })
        }
        courseDetails[0].instructor.password = undefined;
        return res.status(200).json({
            success:true,
            message:"Course fetched successfully now.",
            data:courseDetails
        });
        
    } catch (error) {
        console.log("Error while fetching all course details:", error);
        return res.status(404).json({
            success:false,
            message:`Can't Fetch Course Data.`,
            error:error.message,
        });
        
    }
};

export async function getInstructorCourses(req, res) {
    try {
        
        // Get user ID from request object
		const userId = req.user.id;

		// Find all courses of the instructor
		const allCourses = await CourseModel.find({ instructor: userId }).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        });

		// Return all courses of the instructor
		res.status(200).json({
			success: true,
			data: allCourses,
		});
    } catch (error) {
        console.error("Error while fetching instructor course:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});
    }
};

export async function editCourse(req, res) {
    try {
        
        const {courseId} = req.body || req.param;
        const {updates} = req.body;
        const course = await CourseModel.findById(courseId)
  
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
    
        // If Thumbnail Image is found, update it
        if (req.files) {
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }
    
        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
            if (key === "tag" || key === "instructions") {
                course[key] = JSON.parse(updates[key])
            } else {
                course[key] = updates[key]
            }
            }
        }
    
        await course.save();
    
        const updatedCourse = await CourseModel.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
            })
            .exec()
    
        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })

    } catch (error) {
        console.error(error)
	    res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  });
    }
};

export async function getFullCourseDetails(req, res) {
    try {
        const { courseId } = req.query;
        const userId = req.user.id;
        const courseDetails = await CourseModel.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
            })
            .exec()

            
        let courseProgressCount = await CourseProgressModel.findOne({
            courseID: courseId,
            userID: userId,
        })
    
        console.log("courseProgressCount : ", courseProgressCount)
    
        if (!courseDetails) {
            return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}.`,
            })
        }
    
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds;
            })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        courseDetails.instructor.password = undefined;
    
        return res.status(200).json({
            success: true,
            data: {
            courseDetails,
            totalDuration,
            completedVideos: courseProgressCount?.completedVideos
                ? courseProgressCount?.completedVideos
                : ["none"],
            },
        })
    } catch (error) {
        console.log("Error while fetching full course details:", error);
        return res.status(500).json({
		success: false,
		message: error.message,
	  })
    }
};


export async function deleteCourse(req, res) {
    try {
        const { courseId } = req.body
        // Find the course
        const course = await CourseModel.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
    
        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await UserModel.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
            })
        }
    
        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await SectionModel.findById(sectionId)
            if (section) {
            const subSections = section.subSection
            for (const subSectionId of subSections) {
                await SubSectionModel.findByIdAndDelete(subSectionId);
            }
            }
    
            // Delete the section
            await SectionModel.findByIdAndDelete(sectionId)
        }
    
        // Delete the course
        await CourseModel.findByIdAndDelete(courseId)

        //Delete course id from Category
        await CategoryModel.findByIdAndUpdate(course.category._id, {
            $pull: { courses: courseId },
            })
        
        //Delete course id from Instructor
        await UserModel.findByIdAndUpdate(course.instructor._id, {
            $pull: { courses: courseId },
            })
    
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.error("Error while deleting the course: ", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
};

export async function searchCourse(req, res) {
    try {
        const { searchQuery } = req.body;

        if (!searchQuery) {
            return res.status(400).json({
                success: false,
                message: "Search query is required.",
            });
        }

        const courses = await CourseModel.find({
            $or: [
                { courseName: { $regex: searchQuery, $options: "i" } },
                { courseDescription: { $regex: searchQuery, $options: "i" } },
                { tag: { $regex: searchQuery, $options: "i" } },
            ],
        })
            .populate("instructor")
            .populate("category")
            .populate("ratingAndReviews")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            data: courses,
        });

    } catch (error) {
        console.error("Error in searchCourse:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message,
        });
    }
};

export async function markLectureAsComplete(req, res) {
    try {
        const { courseId, subSectionId, userId } = req.body;

        // Validate input
        if (!courseId || !subSectionId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Check if course progress exists
        let progress = await CourseProgressModel.findOne({
            userID: userId,
            courseID: courseId,
        });

        // If not exist, create new progress document
        if (!progress) {
            progress = await CourseProgressModel.create({
                userID: userId,
                courseID: courseId,
                completedVideos: [subSectionId],
            });

            // Link progress to user
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $push: { courseProgress: progress._id } },
                { new: true }
            ).populate("courseProgress");

            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "Lecture marked as complete.",
                data: user,
            });
        }

        // If already marked, return early
        if (progress.completedVideos.some(
            id => id.toString() === subSectionId.toString()
        )) {
            return res.status(400).json({
                success: false,
                message: "Lecture already marked as complete.",
            });
        }

        // Else, push new completed subSection
        await CourseProgressModel.findOneAndUpdate(
            { userID: userId, courseID: courseId },
            { $push: { completedVideos: subSectionId } }
        );

        const user = await UserModel.findById(userId).populate("courseProgress");

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Lecture marked as complete.",
            data: user,
        });

    } catch (error) {
        console.error("Error marking lecture as complete:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
