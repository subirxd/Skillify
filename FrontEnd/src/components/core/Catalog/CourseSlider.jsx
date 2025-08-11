import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import CourseCard from './CourseCard'
import {Pagination, Autoplay, FreeMode, Navigation} from "swiper/modules"


function CourseSlider({Courses}) {
  return (
    <>
        {
            Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={true}
                    modules={[FreeMode, Pagination]}
                    breakpoints={{
                        1024: {
                        slidesPerView: 3,
                        },
                    }}
                    className="max-h-[30rem]"
                >
                    {
                        Courses?.map((course, index) => {
                            return (
                                <SwiperSlide key={index}>
                                <CourseCard
                                course={course} 
                                    height={"h-[250px]"}
                                /> 
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            )
            : (
                <p className="text-xl text-richblack-5">No Courses Found</p>
            )
        }
    </>
  )
}

export default CourseSlider