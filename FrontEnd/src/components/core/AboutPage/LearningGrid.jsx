import React from 'react'
import { LearningGridData } from '../../../data/LearningGridData'
import HighLightText from '../Homepage/HighLightText'
import Button from '../Homepage/Button'

function LearningGrid() {
  return (
        <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
            {
                LearningGridData.map((data, index) => {
                    return (
                        <div key={index}
                        className={`${index === 0 && "xl:col-span-2 xl:h-[294px]"}
                        ${data.order % 2 === 0 
                        ? "bg-richblack-700 h-[294px]"
                        : data.order % 2 === 1
                        ? "bg-richblack-800 h-[294px]"
                        : "bg-transparent"
                        }
                        ${data.order === 3 && "lg:col-start-2"}
                        `}
                        >
                            {
                                data.order < 0 ? (
                                    <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                                        <div className="text-4xl font-semibold ">
                                            {data.heading}
                                            <HighLightText text={data.highlightText} />
                                        </div>
                                        <p className="text-richblack-300 font-medium"> {data.description} </p>

                                        <div className='w-fit mt-2'>
                                            <Button active={true} linkto={data.BtnLink}>
                                                {data.BtnText}
                                            </Button>
                                        </div>
                                        
                                    </div>
                                ) 
                                : (
                                    <div className="p-8 flex flex-col gap-8">
                                        <h1 className="text-richblack-5 text-lg"> {data.heading} </h1>
                                        <p className="text-richblack-300 font-medium"> {data.description} </p>
                                    </div>
                                )
                            }

                        </div>
                    )
                })
            }
        </div>
  )
}

export default LearningGrid