import React from 'react'
import { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

import { VscAdd } from "react-icons/vsc"
import { fetchInstructorCourses } from "../../../../Services/operations/courseAPI";
import IconButton from '../../../common/IconButton';
import CourseTable from './CourseTable';


function MyCourses() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    const fetchCourse = async () => {

        let result = await fetchInstructorCourses();
        if(result){
            setCourses(result);
        }
        
    }

    useEffect(() => {

        fetchCourse();

    }, []);

  return (
    <div>
        <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconButton
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconButton>
      </div>
      {courses && <CourseTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}

export default MyCourses