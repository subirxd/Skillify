import React from 'react'
import image1 from "../assets/Images/aboutus1.webp"
import image2 from "../assets/Images/aboutus2.webp"
import image3 from "../assets/Images/aboutus3.webp"
import image4 from "../assets/Images/FoundingStory.png"
import HighLightText from "../components/core/Homepage/HighLightText"
import Quote from '../components/core/AboutPage/Quote'
import StatsComponent from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactForm from '../components/core/AboutPage/ContactForm'
import Footer from '../components/Common/Footer'

function AboutUs() {
  return (
    <div className="bg-richblack-900">
      {/* section1 */}
      <section className="bg-richblack-800">
        <div className="relative mx-auto flex w-11/12 max-w-screen-xl flex-col justify-between gap-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <header className="mx-auto py-20 text-3xl sm:text-4xl lg:text-5xl font-semibold lg:w-[70%] leading-tight">
            Driving Innovation in Online Education for a{" "}
            <HighLightText text="Brighter Future" />
            <p className="mx-auto mt-5 text-center text-sm sm:text-base font-medium text-richblack-300 lg:w-[95%]">
              Skillify is at the forefront of driving innovation in online education. 
              We're passionate about creating a brighter future by offering cutting-edge courses, 
              leveraging emerging technologies, and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-1/2 grid w-full max-w-4xl translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-4 lg:gap-6">
            {[image1, image2, image3].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-screen-xl flex-col justify-between gap-10 text-richblack-200 px-4 sm:px-6 lg:px-8">
          <div className="h-[100px]"></div>
          <Quote />
        </div>
      </section>

      {/* section 3 */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-11/12 max-w-screen-xl flex-col justify-between gap-16 text-richblack-200">
          {/* founding story */}
          <div className="flex flex-col items-center gap-12 lg:flex-row justify-between">
            {/* text */}
            <div className="my-24 flex lg:w-1/2 flex-col gap-8">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent">
                Our Founding Story
              </h1>
              <p className="text-sm sm:text-base font-medium text-richblack-300 leading-relaxed">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education...
              </p>
              <p className="text-sm sm:text-base font-medium text-richblack-300 leading-relaxed">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems...
              </p>
            </div>
            {/* image */}
            <div className="flex justify-center">
              <img
                src={image4}
                className="rounded-lg shadow-[0_0_25px_0] shadow-[#FC6767] hover:shadow-[#fd8f8f] transition-shadow duration-300"
                alt="Founding Story"
              />
            </div>
          </div>

          {/* vision & mission */}
          <div className="flex flex-col items-center gap-12 lg:flex-row justify-between">
            {/* vision */}
            <div className="my-24 flex lg:w-2/5 flex-col gap-6">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent">
                Our Vision
              </h1>
              <p className="text-sm sm:text-base font-medium text-richblack-300 leading-relaxed">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people learn...
              </p>
            </div>
            {/* mission */}
            <div className="my-24 flex lg:w-2/5 flex-col gap-6">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent">
                Our Mission
              </h1>
              <p className="text-sm sm:text-base font-medium text-richblack-300 leading-relaxed">
                Our mission goes beyond just delivering courses online...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <section className="mt-16">
        <StatsComponent />
      </section>

      {/* section 5 */}
      <section className="mx-auto mt-20 flex w-11/12 max-w-screen-xl flex-col justify-between gap-20 text-white px-4 sm:px-6 lg:px-8 mb-[150px]">
        <LearningGrid />
        <ContactForm />
      </section>

      {/* section 6 */}
      <Footer />
    </div>
  )
}

export default AboutUs