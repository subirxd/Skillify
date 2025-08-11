import React from 'react'
import CustomButton from "./Button"
import HighLightText from './HighLightText'
import { FaArrowRight } from 'react-icons/fa6'
import {TypeAnimation} from "react-type-animation"

function CodeBlocks({position, heading, subheading, cbutton1, cbutton2, codeblock, backgroundGradient, codeColor

}) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10 `}>

    {/* section1 */}
    <div className='w-[50%] flex flex-col gap-8'>
        {heading}
        <div className='text-richblack-300 font-bold '>
            {subheading}
        </div>

        <div className='flex gap-7 mt-7'>
            <CustomButton active={cbutton1.active} linkto={cbutton1.linkto}>
                <div className='flex gap-2 items-center'>
                {cbutton1.btnText}
                <FaArrowRight/>
                </div>
            </CustomButton>
            
            <CustomButton active={cbutton2.active} linkto={cbutton2.linkto}>
                {cbutton2.btnText}
            </CustomButton>
        </div>
    </div>

    {/* section 2 */}
    <div className='h-fit code-border flex flex-row py-3 text-[10px] sm:textsm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]'>
        <div className='text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold'>
            
            {Array.from({ length: 11 }, (_, i) => (
            <p key={i}>{i + 1}</p>
          ))}

        </div>
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
        <div className={`${backgroundGradient}`}></div>
            <TypeAnimation
            sequence={[codeblock, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={
                {
                    whiteSpace: "pre-line",
                    display: "block"
                }
            }

             />
        </div>
    </div>

    </div>
  )
}

export default CodeBlocks