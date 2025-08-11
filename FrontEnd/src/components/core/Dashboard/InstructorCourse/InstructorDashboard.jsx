import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { instructorDashboardData } from '../../../../Services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../../Services/operations/courseAPI';
import { useSelector } from 'react-redux';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function InstructorDashboard() {
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructordata] = useState(null);
    const [courses, setCourses] = useState([]);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    useEffect(() => {
        const getCourseData = async() => {
            setLoading(true);
            try {
                const response = await instructorDashboardData();
                const result = await fetchInstructorCourses();
                
                if (response) {
                    setInstructordata(response);
                }
                if (result) {
                    setCourses(result);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                // Handle errors
            } finally {
                setLoading(false);
            }
        }
        getCourseData();
    }, []);
    const totalAmount = instructorData?.reduce((acc,curr) => acc += curr.totalRevenue, 0) || 0;
    const totalStudents = instructorData?.reduce((acc, curr) => acc += curr.totalStudents, 0) || 0;

    return (
        <div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-richblack-5">
                    Hi {user?.firstName}
                </h1>
                <p className="font-medium text-richblack-200">
                    Let's start something new
                </p>
            </div>
            {loading ? (
                <div className="spinner"></div>
            ) : courses?.length > 0 ? (
                <div>
                    <div className="my-4 flex h-[550px] space-x-4">
                        {/* Render chart */}
                        {totalAmount > 0 || totalStudents > 0 ? (
                            <InstructorChart courses={courses} />
                        ) : (
                            <div className="flex-1 rounded-md bg-richblack-800 p-6">
                                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                                <p className="mt-4 text-xl font-medium text-richblack-50">
                                    Not Enough Data To Visualize
                                </p>
                            </div>
                        )}
                        {/* Total Statistics */}
                        <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                            <p className="text-lg font-bold text-richblack-5">Statistics</p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-lg text-richblack-200">Total Courses</p>
                                    <p className="text-3xl font-semibold text-richblack-50">
                                        {courses.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-richblack-200">Total Students</p>
                                    <p className="text-3xl font-semibold text-richblack-50">
                                        {totalStudents}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-richblack-200">Total Income</p>
                                    <p className="text-3xl font-semibold text-richblack-50">
                                        Rs. {totalAmount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-md bg-richblack-800 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                            <Link to="/dashboard/my-courses">
                                <p className="text-xs font-semibold text-yellow-50">View All</p>
                            </Link>
                        </div>
                        <div className="my-4 flex items-start space-x-6">
                            {courses.slice(0, 3).map((course) => (
                                <div key={course._id} className="w-1/3">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="h-[201px] w-full rounded-md object-cover"
                                    />
                                    <div className="mt-3 w-full">
                                        <p className="text-sm font-medium text-richblack-50">
                                            {course.courseName}
                                        </p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <p className="text-xs font-medium text-richblack-300">
                                                {course.studentsEnrolled.length} students
                                            </p>
                                            <p className="text-xs font-medium text-richblack-300">
                                                |
                                            </p>
                                            <p className="text-xs font-medium text-richblack-300">
                                                Rs. {course.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
                    <p className="text-center text-2xl font-bold text-richblack-5">
                        You have not created any courses yet
                    </p>
                    <Link to="/dashboard/add-course">
                        <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
                            Create a course
                        </p>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default InstructorDashboard;