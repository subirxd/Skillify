import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createSubSection, updateSubSection } from '../../../../../Services/operations/courseAPI';
import { setCourse } from '../../../../../Slices/courseSlice';
import {RxCross1} from "react-icons/rx"
import CourseThumbnail from '../CourseInformation/CourseThumbnail';
import IconButton from '../../../../Common/IconButton';

function SubSectionModal({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false
}) {

    const {
        register,
        setValue,
        getValues,
        formState:{errors},
        handleSubmit,
        
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);
    const {course} = useSelector((state) => state.course);

    useEffect(() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.VideoUrl);
        }
    }, []);

    const isFormUpdated = () => {
        const currentValues= getValues();

        if(currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.VideoUrl
        ) {
            return true;
        }
        else{
            return false;
        }
    }

    const handleEditSubSection = async() => {
        const currentValues = getValues();

        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle);
        }

         if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc);
        }

         if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("videoFile", currentValues.lectureVideo);
        }

        setLoading(true);

        try {
            const result = await updateSubSection(formData, token);

            if(result){
                dispatch(setCourse(result));
            }

            setModalData(null);

        } catch (error) {
            console.log(error);
            toast.error("Failed to edit sub-section");
        }

        setLoading(false);
    }

    const onSubmit = async(data) =>{
        if(view){
            return;
        }
        
        if(edit){
            if(!isFormUpdated){
                toast.warn("No changes made to the sub-section")
                return;
            }
            else{
                handleEditSubSection();
            }
            return;
        }

        const  formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("videoFile", data.lectureVideo);

        console.log(formData.get("videoFile"));

        setLoading(true);

        try {
            const response = await createSubSection(formData);

            if(response){
                dispatch(setCourse(response));
            }

            setModalData(null);
        } catch (error) {
            console.log("error : ", error);
            toast.error(response);
        }

        setLoading(false);
    }
    const mode = view ? "Viewing" : edit ? "Editing" : add ? "Adding" : "";

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto  bg-opacity-10 backdrop-blur-sm">
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5"> {mode} Lecture</p>
                <button
                onClick={() => (!loading ? setModalData(null): {})}
                >
                    <RxCross1 className="text-2xl text-richblack-5"/>
                </button>
            </div>

            <form onSubmit = {handleSubmit(onSubmit)}
             className="space-y-8 px-8 py-10"
            >
                    <CourseThumbnail 
                        name={"lectureVideo"}
                        label={"Lecture Video"}
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video = {true}
                        viewData={view ? modalData.videoUrl : null}
                        editData={edit ? modalData.lectureVideo : null}
                    />

                    <div className="flex flex-col space-y-2">
                        <label htmlFor='lectureTitle'
                        className="text-sm text-richblack-5"
                        > Lecture Title {!view && <sup className="text-pink-200">*</sup>}   
                        </label>

                        <input 
                            type='text'
                            id='lectureTitle'
                            name='lectureTitle'
                            placeholder='Enter lecture title'
                            {...register("lectureTitle", {required: true})}
                            className='form-style w-full'
                            disabled = {view || loading}
                        />
                        {
                            errors.lectureTitle && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Title is  required</span>
                            )
                        }
                    </div>

                    <div>
                        <label htmlFor='lectureDesc'> Lecture Description  
                        {!view && <sup className="text-pink-200">*</sup>} 
                        </label>

                        <textarea
                            id='lectureDesc'
                            name='lectureDesc'
                            placeholder='Enter lecture description'
                            {...register("lectureDesc", {required: true})}
                            className="form-style resize-x-none min-h-[130px] w-full"
                            disabled={view || loading}
                        />
                        {
                            errors.lectureTitle && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Description is  required</span>
                            )
                        }
                    </div>

                    {
                        !view && (
                            <div className="flex justify-end">
                                <IconButton
                                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                                type='submit'
                                 />
                            </div>
                        )
                    }
            </form>
        </div>
    </div>
  )
}

export default SubSectionModal