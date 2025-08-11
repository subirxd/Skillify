import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../../common/IconButton';
import {useNavigate} from "react-router-dom"
import { apiConnector } from '../../../../../Services/apiConnector';
import { editCourseDetails } from '../../../../../Services/operations/courseAPI';
import { toast } from 'react-toastify';
import { resetCourseState, setCourse, setStep } from "../../../../../Slices/courseSlice"

function index() {
    const{
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors}
    } = useForm();

    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state => state.auth));
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async () => {

    const currentValues = getValues();
    const newStatus = currentValues.Published ? "Published" : "Draft";

    if (course?.status === newStatus) {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
        return;
    }

    const updates = {
        status: newStatus,
    };
    const courseId = course._id;

    try {
        setLoading(true);
        const response = await editCourseDetails({ courseId, updates });

        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
        
    } catch (error) {
        console.error("Error updating course status:", error);
        toast.error(error.response?.data?.message || "Something went wrong. Failed to save changes.");

    } finally {
        setLoading(false);
    }
};

    const goBack = () => {
        console.log("Loading", loading);
        dispatch(setStep(2));
    }

  return (
    <div className='rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700'>

        <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-6 mb-8">
                <input
                type='checkbox'
                name='Published'
                id = 'Published'
                className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                {...register("Published")}
                 />
                <label htmlFor='Published'
                className="ml-2 text-richblack-400"
                >
                    Make this course published
                </label>

            </div>

            <div className="ml-auto flex max-w-max items-center gap-x-4">
                <button
                disabled={loading}
                type='button'
                onClick={goBack}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                >
                    Back
                </button>

                <IconButton
                disabled={loading}
                text={"Save Changes"}
                type='submit'

                 />
            </div>
        </form>
    </div>
  )
}

export default index