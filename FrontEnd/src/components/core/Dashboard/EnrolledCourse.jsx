import React, { useEffect, useState } from 'react'
import { getUserEnrolledCourses } from '../../../Services/operations/profileAPI'
import {useDispatch, useSelector} from "react-redux"
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';

function EnrolledCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const [userData, setUserData] = useState(null);
    const {token} = useSelector((state) => state.auth)

    const getEnrolledCourses = async() => {
      try {
        const result = await dispatch(getUserEnrolledCourses(token));
        setUserData(result);
        setEnrolledCourses(result.courses);

      } catch (error) {
        console.log("Unable to fetch enrolled courses: ", error);
      }
    }

    const progressPercentage = (course) => {
    if (!course) return 0;

    const totalNoOfLecture = course?.courseContent?.reduce(
      (total, section) => total + (section?.subSection?.length || 0),
      0
    );

    if (totalNoOfLecture === 0) return 0;
    const userCompleted = userData?.courseProgress?.find(
      (item) => item.courseID?.toString() === course._id?.toString()
    );
    const completedCount = userCompleted?.completedVideos?.length || 0;
    return Math.round((completedCount / totalNoOfLecture) * 100);
  };


    const totalDuration = (course) => {
        let totalSec = 0;

        if(course){
          if(course?.courseContent){
            course?.courseContent.forEach((section) => {
              section.subSection.forEach((subSection) =>{
                totalSec += parseFloat(subSection.timeDuration)
              })
            })
          }
        }

        const hour = Math.floor(totalSec / 3600);
        const min = Math.floor((totalSec % 3600) / 60);
        const sec = Math.floor(totalSec % 60);

        const total = `${hour}hr(s) ${min}min(s) ${sec}sec(s)`
        return total
    }
 
    useEffect(() => {

      getEnrolledCourses();
    }, []);

  return (
    <div className='text-white'>
        {
          !enrolledCourses ? (<div className='spinner'></div>) 
          : (
            !enrolledCourses.length ? (<p className="grid h-[10vh] w-full place-content-center text-richblack-5">
            You have not enrolled in any course yet
            </p>)
            
            : (
              <div className="my-8 text-richblack-5">
                  <div className="flex rounded-t-lg bg-richblack-500 ">
                      <p className="w-[45%] px-5 py-3">Course Name</p>
                      <p className="w-1/4 px-2 py-3">Durations</p>
                      <p className="flex-1 px-2 py-3">Progress</p>
                  </div>
                  {/* cards starting */}

                  {
                    enrolledCourses.map((course, index) => {
                      return (
                        <div key={index} className={`flex items-center border border-richblack-700 ${
                              index === course.length - 1 ? "rounded-b-lg" : "rounded-none"
                            }`}>
                            <div
                            className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                            onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                            >
                                <img src={course.thumbnail} 
                                alt='courseThumbnail'
                                className="h-14 w-14 rounded-lg object-cover"
                                 />
                                 <div className="flex max-w-xs flex-col gap-2">
                                    <p className="font-semibold"> {course.courseName} </p>
                                    <p className="text-xs text-richblack-300"> {course.courseDescription.slice(0, 50)}... </p>
                                 </div>
                            </div>

                            <div className="w-1/4 px-2 py-3">
                              {totalDuration(course)}
                            </div>

                            <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                <p>Progress: {progressPercentage(course) || 0}%</p>
                                <ProgressBar completed={progressPercentage(course) || 0} maxCompleted={100}
                                height='8px'
                                isLabelVisible={false}
                                 />
                            </div>
                        </div>
                      )
                    })
                  }
              </div>
            )
          )
        }
    </div>
  )
}

export default EnrolledCourse