import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

import { getAllReviews } from '../../../Services/operations/ratingAndReviewsAPI';
import RatingStars from '../../Common/RatingStars';

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews();
        if (response) {
          // Shuffle the reviews to show different ones on each load
          const shuffledReviews = response.sort(() => Math.random() - 0.5);
          setReviews(shuffledReviews);
        }
      } catch (error) {
        console.error('Could not fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="w-full max-w-max-content mb-3">
      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 25,
          },
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper w-full"
      >
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <SwiperSlide key={index} className="w-full max-w-[350px] p-6 bg-richblack-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                {/* User Image */}
                <img
                  src={review.user.image}
                  alt="user avatar"
                  className="w-12 h-12 object-cover rounded-full"
                />
                {/* User Name and Country */}
                <div className="flex flex-col">
                  <p className="text-richblack-5 font-semibold text-lg">{`${review.user.firstName} ${review.user.lastName}`}</p>
                  <p className="text-richblack-200 text-sm">Learner</p>
                </div>
              </div>

              {/* Review Text */}
              <div className="text-richblack-25 text-md line-clamp-3 mb-4">
                {
                  <div>
                    {
                      review.review.length > 15 ? <p> {review.review.slice(0, 15)}...</p>  : <p> {review.review} </p>
                    }
                  </div>
                }
              </div>

              {/* Review Rating */}
              <div className="flex items-center gap-2">
                <p className="text-yellow-50 font-bold">{review.rating.toFixed(1)}</p>
                <RatingStars Review_Count={review.rating} />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-center text-richblack-5 text-xl">No reviews available yet.</p>
        )}
      </Swiper>
    </div>
  );
}

export default ReviewSlider;