import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCategory } from '../../../../../Services/operations/courseAPI';
import RequirementField from './RequirementField';
import { setCourse, setStep } from '../../../../../Slices/courseSlice';

import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import IconButton from '../../../../Common/IconButton';
import { toast } from 'react-toastify';
import { COURSE_STATUS } from '../../../../../Utils/constants';
import ChipInput from './ChipInput';
import CourseThumbnail from './CourseThumbnail';

function CourseInformationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm();

    const dispatch = useDispatch();
    const {course, editCourse} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const categories = await fetchCategory();
            if(categories.length > 0){
                setCourseCategories(categories)
            }
            setLoading(false);
        }

        if(editCourse){
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }

        getCategories();
        console.log(course)
    }, [course]);

    const isFormUpdated = () => {
        
        const currentValues = getValues();
        console.log("changes after editing form values:", currentValues)

        if(
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !==
                course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
            
        ){
            return true;
        }
        else{
            return false;
        }
    }

    const onSubmit = async (data) => {
    try {
        setLoading(true); 

        if (editCourse) {
            if (isFormUpdated()) {
                const formData = new FormData();
                const currentValues = getValues();

                formData.append("courseId", course._id);

                if (currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }
                if (currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }
                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags));
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory);
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }
                if (currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements));
                }
                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnail", data.courseImage);
                }
                
                const result = await editCourseDetails(formData);
                console.log(result);

                if (result) {
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
            } else {
                toast.error("No changes are here to be submitted");
            }
        } else {
            const formData = new FormData();
            formData.append("courseName", data.courseTitle);
            formData.append("courseDescription", data.courseShortDesc);
            formData.append("price", data.coursePrice);
            formData.append("tag", JSON.stringify(data.courseTags));
            formData.append("whatYouWillLearn", data.courseBenefits);
            formData.append("category", data.courseCategory);
            formData.append("status", COURSE_STATUS.DRAFT);
            formData.append("instructions", JSON.stringify(data.courseRequirements));
            formData.append("thumbnailImage", data.courseImage);

            const result = await addCourseDetails(formData);
            if (result) {
                dispatch(setStep(2));
                dispatch(setCourse(result));
            }
        }
    } catch (error) {
        console.error("Form Submission Error:", error);
        toast.error("Failed to submit course details. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (

        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >

        <div className="flex flex-col space-y-2">
            <label htmlFor='courseTitle'
            className="text-sm text-richblack-5"
            >Course Title <sup className="text-pink-200">*</sup></label>
            <input
                type='text'
                id='courseTitle'
                placeholder='Enter course title'
                {...register("courseTitle", {required: true})}
                className="form-style w-full"
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200"> Course Title is required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label htmlFor='courseShortDesc'
            className="text-sm text-richblack-5"
            >Course Short Description <sup className="text-pink-200">*</sup></label>
            <input
                type='text'
                id='courseShortDesc'
                placeholder='Enter course description'
                {...register("courseShortDesc", {required: true})}
               className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course short description is required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2 relative">
            <label htmlFor='coursePrice'
            className="text-sm text-richblack-5"
            >Course Price <sup className="text-pink-200">*</sup></label>
            <input
                id='coursePrice'
                placeholder='Enter course price'
                {...register("coursePrice", {
                    required: true,
                    valueAsNumber: true,
                    pattern:{
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    }
                })}
                className="form-style w-full !pl-12 relative"
            />
            <HiOutlineCurrencyRupee
            className="absolute left-3 top-12 inline-block -translate-y-1/2 text-2xl text-richblack-400"
             />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course price is required</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label htmlFor='courseCategory'
            className="text-sm text-richblack-5"
            >Course Category <sup className="text-pink-200">*</sup></label>
            <select
            id='courseCategory'
            defaultValue=""
            {...register("courseCategory", {required: true})}
            className="form-style w-full"
            >
            <option value="" disabled>Choose a Category</option>
            {
                !loading && courseCategories.map((category, index) => {
                    return (
                        <option value={category._id} key={index}> {category.name}</option>
                    )
                })
            }
            </select>
            {
                errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course category is required</span>
                )
            }

        </div>

        
        <ChipInput 
        label="Tags"
        name="courseTags"
        placeholder ="Enter tags and press enter"
        register = {register}
        errors = {errors}
        setValue = {setValue}
        getValues = {getValues}

        />

        
         <CourseThumbnail 
            name= "courseImage"
            label= "Add a thumbnail"
            register = {register}
            errors = {errors}
            setValue = {setValue}
            getValues = {getValues}
        />

        <div className="flex flex-col space-y-2">
            <label htmlFor='courseBenefits'
            className="text-sm text-richblack-5"
            >Benefit of course <sup>*</sup></label>
            <textarea
            name='courseBenefits'
            id= 'courseBenefits'
            placeholder='Benefits of the course'
            {...register("courseBenefits", {required: true})}
             className="form-style resize-x-none min-h-[130px] w-full"
             />
             {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Benefits of the course is required</span>
                )
             }
        </div>

        <RequirementField 
            name="courseRequirements"
            label="Requirement / Instructions"
            register = {register}
            errors = {errors}
            setValue = {setValue}
            getValues = {getValues}
        />

        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button
                    onClick={() => dispatch(setStep(2))}
                     className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue without saving
                    </button>
                )
            }

            <IconButton
            disabled={loading}
            text={!editCourse ? "Next" : "Save Changes"}
            type='submit'
             />
        </div>
        </form>
  )
}

export default CourseInformationForm