import { SubSectionModel } from "../Models/subSection.js";
import { SectionModel } from "../Models/section.js";
import { uploadImageToCloudinary } from "../Utils/imageUploader.js";
import {CourseModel} from "../Models/course.js"

export async function createSubSection(req, res) {
    try {
        
        //data fetch from req body & extract video from file
        const {title, description, sectionId} = req.body;
        const videoFile = req.files.videoFile;
        //data validation
        if(!title || !description || !videoFile|| !sectionId){
            return res.status(400).json({
                success: false,
                message:"All fields are required."
            });
        };
        //upload video to cloudinary
        const uploadedVideo = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);
        console.log("Uploading video details: ", uploadedVideo.duration);
        //create subsection
        const newSubSection = await SubSectionModel.create(
            {
            title: title, 
            timeDuration: `${uploadedVideo.duration}`, 
            description: description, 
            videoUrl: uploadedVideo.secure_url
            }
        );
        //add subsection_id to sectionSchema
        const updatedSection = await SectionModel.findByIdAndUpdate(sectionId, {
            $push:{
                subSection: newSubSection._id,
            }
        }, {new: true}).populate("subSection").exec();

        const data = await CourseModel.find({ courseContent: sectionId }).populate({
        path: "courseContent",
        populate: {
            path: "subSection",
        },
        });
        //return response
        return res.status(200).json({
            success: true,
            message: "Sub section created successfully.",
            data:data,
        });

    } catch (error) {
        console.log("Error while creating Sub section: ", error);
        return res.status(500).json({
            success: false,
            message:"Something went wrong while creating Sub section.",
            error: error.message,
        });
    }
};

export async function updateSubSection(req, res){
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSectionModel.findById(subSectionId)

        if (!subSection) {
        return res.status(404).json({
            success: false,
            message: "SubSection not found",
        })
        }

        if (title !== undefined) {
        subSection.title = title
        }

        if (description !== undefined) {
        subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
        const video = req.files.videoFile
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();

        const data = await CourseModel.find({courseContent: sectionId}).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        })

        return res.json({
        success: true,
        message: "Section updated successfully",
        data: data,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
        })
    }
};


export async function deleteSubSection(req, res){
    try {
        const { subSectionId, sectionId } = req.body
        await SectionModel.findByIdAndUpdate(
        { _id: sectionId },
        {
            $pull: {
            subSection: subSectionId,
            },
        }
        )
        const subSection = await SubSectionModel.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
        return res
            .status(404)
            .json({ success: false, message: "SubSection not found" })
        }

        const data = await CourseModel.find({courseContent: sectionId}).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        })

        return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: data[0],
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
        })
    }
};