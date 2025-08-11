import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {GrAddCircle} from "react-icons/gr"
import { useDispatch, useSelector } from 'react-redux';
import {BiRightArrow} from "react-icons/bi"

import IconButton from '../../../../common/IconButton';
import { setEditCourse, setStep, setCourse } from '../../../../../Slices/courseSlice';
import { toast } from 'react-toastify';
import { createSection, updateSection } from '../../../../../Services/operations/courseAPI';
import NestedView from './NestedView';


function CourseBuilderForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    } = useForm();


    const dispatch = useDispatch();
    const [editSectionName, setEditSectionName] = useState(null);
    const {course} = useSelector((state) => state.course);
    const {step, editCourse} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);


    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if(editSectionName === sectionId){
            cancelEdit();
            return ;
        }
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);

    }

    const cancelEdit = () => {
        setEditSectionName(false);
        setValue("sectionName", "");
    }

    const goBack = () =>{
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    } 

    const gotoNext = () =>{
        
        if(course.courseContent.length === 0 ){
            toast.error("Please add at least one section");
            return ;
        }
        if(course.courseContent.some((section) => section.subSection.length === 0)){
            toast.error("Please add at least one lecture in each section");
            return;
        }

        dispatch(setStep(3));

    }

    const onSubmit = async (data) => {
        setLoading(true);
        let result;

        try {
            if(editSectionName){
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    courseId : course._id,
                    sectionId : editSectionName,
                }, token)
        }
        else{
            result = await createSection({
                sectionName: data.sectionName,
                courseId: course._id,
            })

        }

        if(result){
            dispatch(setCourse(result));
            setEditCourse(null);
            setValue("sectionName", "");
        }
        } catch (error) {
            console.error("Error during section submission:", error);
            toast.error("Something went wrong. Please try again.");
        }

        setLoading(false);
    }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-2">
                <label htmlFor='sectionName' className="text-sm text-richblack-5">
                Section name <sup className="text-pink-200">*</sup></label>
                <input
                id='sectionName'
                name='sectionName'
                placeholder='Enter you section name'
                {...register("sectionName", {required:true})}
                className='w-full form-style'
                 />
                 {
                    errors.sectionName && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Section name is required</span>
                    )
                 }
            </div>
            <div className="flex items-end gap-x-4">
                <IconButton
                type={"Submit"}
                text={editSectionName ? "Edit Section Name" : "Create Section"}
                outline={true}
                customClasses={"text-white"}
                 >

                 <GrAddCircle size={20} className='text-yellow-50' />
                 </IconButton>

                 {editSectionName && (
                    <button 
                    type='button'
                    onClick={cancelEdit}
                    className='text-sm text-richblack-300 underline'
                    >
                        Cancel Edit
                    </button>
                 )}

            </div>
        </form>

        {
            course?.courseContent?.length > 0 && (
                <NestedView handleChangeEditSectionName = {handleChangeEditSectionName} />
            )
        }

        <div className='flex justify-end gap-x-3'>

            <button
            onClick={goBack}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
                Back
            </button>

            <IconButton
            text={"Next"}
            onclick={gotoNext}
            
            >
            <BiRightArrow />
            </IconButton>
        </div>


    </div>
  )
}

export default CourseBuilderForm