import React, { useState } from 'react'

import ConfirmationModal from "../../../../Common/ConfirmationModal"
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx"
import {MdEdit} from "react-icons/md"
import {RiDeleteBin6Line} from "react-icons/ri"
import { BiSolidDownArrow } from 'react-icons/bi'
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from './SubSectionModal'
import { deleteSection, deleteSubSection } from '../../../../../Services/operations/courseAPI'
import { setCourse } from '../../../../../Slices/courseSlice'
import { toast } from 'react-toastify'


function NestedView({handleChangeEditSectionName}) {
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setviewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        try {
            const result = await deleteSection({sectionId, courseId: course._id}, token);

            if(result){
                dispatch(setCourse(result));
            }
            setConfirmationModal(null);
        } catch (error) {
            console.log("Error in delete section: ", error);
            toast.error("Failed to delete Section");
        }
    }

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        try {
            const result = await deleteSubSection({sectionId, subSectionId}, token);

            if(result){
                dispatch(setCourse(result));
            }

            setConfirmationModal(null);
        } catch (error) {
            
        }
    }


  return (
    <div>


        <div className="rounded-lg bg-richblack-700 p-6 px-8" id='nestedViewContainer'>
            {course?.courseContent?.map((section) => {
                return(
                    <details key= {section._id} open>

                        <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                            <div className='flex items-center gap-x-3'>
                                <RxDropdownMenu className="text-2xl text-richblack-50" />
                                <p className="font-semibold text-richblack-50"> {section.sectionName} </p>
                            </div>
                            <div className='flex items-center gap-x-3 '>

                                <button
                                onClick = {() => handleChangeEditSectionName(section._id, section.sectionName)}
                                >
                                    <MdEdit className="text-xl text-richblack-300"/>
                                </button>


                                <button
                                onClick={() => setConfirmationModal({
                                    text1: "Delete this section",
                                    text2: "All the lecture of this section will be deleted.",
                                    btn1Text: "Delete ",
                                    btn2Text: "Cancel",
                                    btn1Handler : () => handleDeleteSection(section._id),
                                    btn2Handler: () => setConfirmationModal(null),
                                    
                                })}
                                >
                                    <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                                </button>
                                <span>|</span>
                                <BiSolidDownArrow className={`text-xl text-richblack-300`} />
                            </div>
                        </summary>

                        <div className="px-6 pb-4">
                            {
                                section.subSection.map((data) => {
                                    return (  <div
                                     key={data?._id}
                                    onClick={() => setviewSubSection(data)}
                                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                    >
                                     <div className="flex items-center gap-x-3 py-2 ">
                                        <RxDropdownMenu className="text-2xl text-richblack-50" />

                                        <p className="font-semibold text-richblack-50"> 
                                        {data.title} 
                                        </p>
                                    </div>

                                    <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-x-3"
                                    >
                                        <button
                                        onClick={() => setEditSubSection({...data, sectionId: section._id})}
                                        >
                                            <MdEdit className="text-xl text-richblack-300"/>
                                        </button>

                                        <button
                                        onClick={() => setConfirmationModal({
                                        text1: "Delete this sub section",
                                        text2: "Current lecture will be deleted.",
                                        btn1Text: "Delete ",
                                        btn2Text: "Cancel",
                                        btn1Handler : () => handleDeleteSubSection(data._id, section._id),
                                        btn2Handler: () => setConfirmationModal(null),
                                        
                                    })}
                                        >
                                        <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                                        </button>
                                    </div>
                                    </div>
                                    )
                                })
                            }

                            <button 
                            onClick={ () => setAddSubSection(section._id)}
                            className="mt-3 flex items-center gap-x-1 text-yellow-50"
                            >
                                <AiOutlinePlus />
                                <p>Add Lecture</p>
                            </button>
                        </div>
                    </details>
                )
            })}
        </div>

        {
            addSubSection 
            ? (<SubSectionModal 
                modalData = {addSubSection}
                setModalData = {setAddSubSection}
                add ={true}
            />) 
            : viewSubSection 
            ? (<SubSectionModal 
                modalData = {viewSubSection}
                setModalData = {setviewSubSection}
                view ={true}
            />) 
            : editSubSection 
            ? (<SubSectionModal 
                modalData = {editSubSection}
                setModalData = {setEditSubSection}
                edit ={true}
            />) 
            : (<div></div>)
        }

        {
            confirmationModal && (
                <ConfirmationModal 
                    modalData={confirmationModal}
                />
            )
        }
    </div>
  )
}

export default NestedView