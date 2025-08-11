import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import RenderSteps from '../AddCourse/RenderSteps';
import { getFullDetailsOfCourse } from '../../../../Services/operations/courseAPI';
import { setCourse, setEditCourse } from '../../../../Slices/courseSlice';
import { toast } from 'react-toastify';

function EditCourse() {
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);

    
    useEffect(() => {
    const courseDetails = async () => {
        setLoading(true);
        try {
            const result = await getFullDetailsOfCourse(courseId, token);

            if (result?.courseDetails) { 
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.courseDetails));
            } else {
                
                console.warn("API returned with no course details, result:", result);
                
            }
        } catch (error) {
            console.error("Failed to fetch course details:", error);
            toast.error("Failed to fetch course details");
            dispatch(setEditCourse(false)); 
            dispatch(setCourse(null)); 
        } finally {
            setLoading(false);
        }
    };

    // Make sure you have a courseId before fetching
    if (courseId) {
        courseDetails();
    }
    }, [courseId, token, dispatch]);

    if(loading){
            return (
                <div className='flex items-center justify-center'>
                <div className='spinner'></div>
                </div>
            )
        }

  return (
    <div className='text-richblack-5'>
        <p>Edit Course</p>

        {
            course ? (<RenderSteps 

            />) 
             : (<p>Course Not Found</p>)
        }
    </div>
  )
}

export default EditCourse