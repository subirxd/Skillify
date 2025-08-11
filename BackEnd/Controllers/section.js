import { SectionModel } from "../Models/section.js";
import { CourseModel } from "../Models/course.js";
import { SubSectionModel } from "../Models/subSection.js";

export async function createSection(req, res) {
    try {
            const { sectionName, courseId } = req.body;

            // Validate input
            if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
            }

            // Check if course exists
            const courseDetails = await CourseModel.findById(courseId);
            if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Invalid Course ID entered.",
            });
            }

            // Create section
            const newSection = await SectionModel.create({ sectionName });

            // Add section to course's courseContent
            const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
            )
            .populate({
                path: "courseContent",
                populate: {
                path: "subSection",
                model: "SubSection",
                },
            })
            .exec();

            // Send response
            return res.status(200).json({
            success: true,
            message: "Section created and course updated successfully.",
            data: newSection,
            updatedCourse,
            });
    } catch (error) {
            console.log("Error while creating section: ", error);
            return res.status(500).json({
            success: false,
            message: "Something went wrong while creating section.",
            error: error.message,
            });
    }
}


export  async function updateSection(req, res) {
    try {
        
        //data fetch
        const {sectionName, sectionId, courseId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message:"All fields are required."
            });
        }
        //update the data
        const updatedSection = await SectionModel.findByIdAndUpdate(sectionId, {sectionName: sectionName}, {new: true});

        const course = await CourseModel.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully.",
            data: course,
        });

    } catch (error) {
        console.log("Error while updating section: ", error);
        return res.status(500).json({
            success: false,
            message:"Something Went wrong while updating section.",
            error: error.message,
        });
    }
};

export async function deleteSection(req, res) {
    try {
        
        const {courseId } = req.body;
        const {sectionId} = req.params;

        // Validate inputs
        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Both sectionId and courseId are required.",
            });
        }

        // Find the section
        const sectionDetails = await SectionModel.findById(sectionId);
        if (!sectionDetails) {
            return res.status(404).json({
                success: false,
                message: "No section found with this ID",
            });
        }

        // Delete all associated subsections
        await Promise.all(
            sectionDetails.subSection.map((subSectionID) =>
                SubSectionModel.findByIdAndDelete(subSectionID)
            )
        );

        // Remove section reference from the course
        await CourseModel.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            },
        });

        // Delete the section itself
        await SectionModel.findByIdAndDelete(sectionId);

        const data = await CourseModel.findById(courseId).populate(
            {
                path:"courseContent",
                populate:{
                    path:"subSection",
                }
            }
        )

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully.",
            data,

        });

    } catch (error) {
        console.error("Error while deleting section:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the section.",
            error: error.message,
        });
    }
}