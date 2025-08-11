import React, { useEffect, useState } from 'react'
import RatingStars from '../../Common/RatingStars'
import { Link } from 'react-router-dom'
import GetAvgRating from '../../../Utils/avgRating';

function CourseCard( {course, height} ) {

    const [avgRatingCount, setAvgRatingCount] = useState(0);

    useEffect(() => {
        
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgRatingCount(count);

    }, [course]);

  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div>
                <div className="rounded-lg">
                    <img src={course?.thumbnail} 
                        alt={`${course.courseName}'s Thumbnail`}
                        className={`h-[250px] w-full rounded-xl object-cover`}
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5"> {course.courseName} </p>
                    <p className="text-sm text-richblack-50"> By:  {course.instructor.firstName} {course.instructor.lastName} </p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5"> {avgRatingCount ? avgRatingCount : 0} </span>
                        <RatingStars 
                            Review_Count={avgRatingCount}
                            Star_Size={20}
                        />
                        <span className="text-richblack-400"> {course.ratingAndReviews.length} Ratings</span>
                    </div>
                    <p className="text-xl text-richblack-5"> {course.price} ₹ </p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default CourseCard