import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import ReactStars from 'react-stars';
import IconButton from '../../Common/IconButton';
import { createRating } from '../../../Services/operations/courseAPI';
import { useParams } from 'react-router-dom';

function CourseReviewModal({setReviewModal}) {
    const {user} = useSelector((state) => state.profile);
    const {courseEntireData} = useSelector((state) => state.viewCourse);
    const {token} = useSelector((state) => state.auth)

    const onSubmit = async() => {
            const rating = getValues("courseRating");
            const review = getValues("courseExperience");
            const courseID = courseEntireData._id;
        try {
            const response = await createRating(review, courseID, rating, token);

            if(response){
                setReviewModal(false);
            }
        } catch (error) {
            console.log(error);
            setReviewModal(false);
        }
    }

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating);
    }

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors}
    } = useForm();

    useEffect(() => {
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    }, [])

  return (
    <div className='z-1000 fixed inset-0 !mt-0 grid h-screen w-screen place-items-center overflow-auto  backdrop-blur-sm'>
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            {/* modal header */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                <button
                className='flex items-center justify-center gap-2 rounded-md px-5 py-2 font-semibold 
                transition-all duration-200 border border-yellow-50 bg-transparent text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900'
                onClick={() => setReviewModal(false)}
                >
                    Close
                </button>
            </div>

            {/* modal body */}

            <div  className="p-6">
                <div className="flex items-center justify-center gap-x-4">
                    <img
                    src={user?.image}
                    alt='userImage'
                     className="aspect-square w-[50px] rounded-full object-cover"
                     />
                     <div>
                        <p className="font-semibold text-richblack-5"> {user.firstName} {user.lastName} </p>
                        <p className="text-sm text-richblack-5">Posting Publicly</p>
                     </div>
                </div>

                <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex flex-col items-center"
                >

                    <div>
                        <ReactStars 
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        activeColor= "#ffd700"
                        />
                    </div>

                    <div>
                        <label htmlFor='courseExperience'
                        className="text-sm text-richblack-5"
                         >Add your experience</label>
                        <textarea
                        id='courseExperience'
                        name='courseExperience'
                        placeholder='Add your experience here'
                        {...register("courseExperience", {required: true})}
                        className="form-style resize-x-none min-h-[130px] w-full"
                        >
                        </textarea>
                        {errors.courseExperience && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">Please add your experience <sup className="text-pink-200">*</sup></span>
                        )}
                    </div>

                    {/* cancel and save button */}
                    <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            setReviewModal(false);
                        }}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                        >
                            Cancel
                        </button>

                        <IconButton
                        text={"Save"}
                        type='submit'
                         />
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal