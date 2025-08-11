import React, { useEffect, useState } from 'react'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import { useSelector } from 'react-redux';
import IconButton from '../../Common/IconButton';
import { IoIosArrowBack } from "react-icons/io"
import { BsChevronDown } from "react-icons/bs"
import { BsChevronUp } from "react-icons/bs"

function VideoDetailsSidebar({setReviewModal}) {
    const [isActive, setIsActive] = useState(null);
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId, subSectionId} = useParams();
    const location  = useLocation();


    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        ; (() => {
            if(!courseSectionData?.length){
                return ;
            }

            const currentSectionIndex = courseSectionData.
            findIndex((data) => data._id === sectionId);
            
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.
            subSection.findIndex((data) => data._id === subSectionId);

            const activeSubSectionId = courseSectionData[currentSectionIndex]?.
            subSection[currentSubSectionIndex]?._id;

            setIsActive(courseSectionData?.[currentSectionIndex]?._id);
            setVideoBarActive(activeSubSectionId);
        }) ()
    }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            {/* for button and headings */}
            <div  className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                {/* buttons */}
                <div className="flex w-full items-center justify-between ">
                    <div 
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                    title="back"
                    >
                        <IoIosArrowBack size={30} />
                    </div>

                    <div>
                        <IconButton
                        text={"Add Review"}
                        customClasses="ml-auto"
                        onclick={() => {
                            setReviewModal(true)
                        }}
                         />
                    </div>
                </div>
                
                {/* headings */}
                <div className="flex flex-col">
                    <p> { courseEntireData?.courseName } </p>
                    <p className="text-sm font-semibold text-richblack-500"> {
                        completedLectures[0] === 'none' ? 0 : completedLectures.length
                    } / {totalNoOfLectures} </p>
                </div>
            </div>

            {/* for sections and subsections */}

            <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((section, index) => {
                        return (
                            <div
                            className="mt-2 cursor-pointer text-sm text-richblack-5"
                            onClick = {() => {
                                if(isActive === section._id){
                                    setIsActive(null);
                                }
                                else{
                                    setIsActive(section?._id)
                                }
                            }}
                            key={index}
                            >
                            {/* section */}
                               <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                    <div className="w-[70%] font-semibold">
                                    {section?.sectionName}
                                    </div>
                                    <div>
                                        {isActive === section._id ? <BsChevronUp /> : <BsChevronDown />}
                                    </div>
                               </div>

                               {/* subsection */}
                               <div >
                                    {
                                        isActive === section._id && (
                                            <div className="transition-[height] duration-500 ease-in-out">
                                                {
                                                    section.subSection.map((subSection, index)=> {
                                                        return (
                                                            <div key={index}
                                                            className={`${videoBarActive === subSection._id ? "bg-yellow-200 text-richblack-800 font-semibold"
                                                            : "hover:bg-richblack-900"}
                                                            flex gap-3 px-5 py-2
                                                            `}
                                                            onClick = {() =>{
                                                                navigate(`/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${subSection._id}`)

                                                                setVideoBarActive(subSectionId._id);
                                                            }}
                                                            >
                                                                <input 
                                                                type='checkbox'
                                                                checked = {completedLectures.includes(subSection._id)}
                                                                onChange={() => {}}
                                                                />
                                                                <span> {subSection?.title} </span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                               </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar