import React, { useEffect, useState } from 'react'
import {Outlet, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"
import { getFullDetailsOfCourse } from '../Services/operations/courseAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../Slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
function ViewCourse() {
    const [reviewModal, setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

     useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      console.log("courseData--------------", courseData);
      
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      console.log(courseData.completedVideos);
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    
  }, [])
    
  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar
            setReviewModal={setReviewModal}
             />

             <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
               <div className="mx-6">
                 <Outlet/>
               </div>
             </div>

             {reviewModal && <CourseReviewModal 
                setReviewModal ={setReviewModal}
             />}
        </div>
    </>
  )
}

export default ViewCourse