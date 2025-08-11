import React from 'react'
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useDispatch, useSelector } from "react-redux"
import { buyCourse } from '../Services/operations/studentAPI'
import { fetchCourseDetails } from '../Services/operations/courseAPI'
import Footer from "../components/Common/Footer"
import GetAvgRating from '../Utils/avgRating'
import { setLoading } from '../Slices/authSlice'
import ConfirmationModal from "../components/Common/ConfirmationModal"
import RatingStars from '../components/Common/RatingStars'
import { formattedDate } from '../Utils/dateFormatter'
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'



function CourseDetails() {
    const {courseId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const [courseDetails, setCourseDetails] = useState(null);
    const {loading} = useSelector((state) => state.profile);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [lectureCount, setLectureCount] = useState(0);
    const [modalData, setModalData] = useState(null);
    const [duration, setDuration] = useState("");
    const [isactive, setIsActive] = useState([]);

    useEffect(() => {
        const getCourseDetails = async() => {
          try {
            const response = await fetchCourseDetails(courseId);
            console.log(response?.data[0]);
            if(response?.data[0]){
              setCourseDetails(response?.data[0]);
            }

          } catch (error) {
           console.log("Error while fetching course data", error.data.message); 
          }
        }

        if(courseId){
          getCourseDetails();
        }
    }, [courseId]);

    useEffect(() => {

      const count = GetAvgRating(courseDetails?.ratingAndReviews);
        setAvgReviewCount(count);

    }, [courseDetails]);

    useEffect(() =>{

      let lectures = 0;

      courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length || 0;
      })

      setLectureCount(lectures);
    }, [courseDetails]);

    useEffect(() => {
    let totalSec = 0;

    if (courseDetails && courseDetails.courseContent) {
        courseDetails.courseContent.forEach((section) => {
            if (section.subSection && Array.isArray(section.subSection)) {
                section.subSection.forEach((subSection) => {
                    if (subSection.timeDuration) {
                        totalSec += parseFloat(subSection.timeDuration);
                    }
                });
            }
        });
    }

    const hr = Math.floor(totalSec / 3600);
    const min = Math.floor((totalSec % 3600) / 60);
    const sec = Math.floor(totalSec % 60);

    setDuration(`${hr} hr : ${min} min : ${sec} sec`);
  }, [courseDetails]);

    if(loading || !courseDetails){
      return <div className='spinner'></div>
    }

    const handleBuyCourse = () => {
      if(token){
        buyCourse([courseId], token, user, navigate, dispatch);
        return;
      }

      setModalData({
        text1: "You're not logged in",
        text2: "Please login to purchase the course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setModalData(null),
      })
    }

    const handleActive = (id) => {
      setIsActive(
        !isactive.includes(id) ? isactive.concat(id)
        : isactive.filter((e) => e !== id)
      )
    }

    const { 
            _id,
            courseName,
            courseDescription,
            thumbnail,
            price,
            whatYouWillLearn,
            courseContent,
            ratingAndReviews,
            instructor,
            createdAt,
            studentsEnrolled,
    } = courseDetails;
    
  return (
    <>
        <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-max-content-tab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span>{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formattedDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={courseDetails}
              setModalData={setModalData}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
        
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-max-content-tab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <Markdown>{whatYouWillLearn}</Markdown>
            </div>
          </div>
          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {lectureCount} {`lecture(s)`}
                  </span>
                  <span>{duration} total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>
             {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isactive}
                  handleActive={handleActive}
                />
              ))}
            </div>
            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {modalData && <ConfirmationModal modalData={modalData} />}
    </>
  )
}

export default CourseDetails