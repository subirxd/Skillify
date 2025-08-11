import React from 'react'
import HighLightText from './HighLightText'
import knowYourProgress from "../../../assets/Images/Know_your_progress.png"
import compareWithOthers from "../../../assets/Images/Compare_with_others.png"
import planYourLessons from "../../../assets/Images/Plan_your_lessons.png"
import CustomButton from './Button'

function LearningLanguageSection() {
  return (
    <div className='mt-[130px] mb-32'>
      <div className='flex flex-col gap-5 items-center'>


          <div className='text-4xl font-semibold text-center'>
              Your swiss knife for
              <HighLightText text={" learning ang langugae"} />
          </div>

          <div className='text-center font-medium w-[70%] text-richblack-600 mx-auto text-base mt-3'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, 
            progress tracking, custom schedule and more.
          </div>

          <div className='flex flex-row items-center justify-center mt-5'>
              <img src={knowYourProgress} 
              alt='Know_Your_Progress_Image'
              className='object-contain -mr-32' /> 

              <img src={compareWithOthers} 
              alt='Know_Your_Progress_Image'
              className='object-contain' /> 

              <img src={planYourLessons} 
              alt='Know_Your_Progress_Image'
              className='object-contain -ml-36' /> 

          </div>

          <div className='w-fit'>
            <CustomButton active={true} linkto={"/signup"}>
            <div>Learn More</div>
            </CustomButton>
          </div>
      </div>
    </div>
  )
}

export default LearningLanguageSection