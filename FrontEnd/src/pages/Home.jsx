import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

/* importing components */
import HighLightText from "../components/core/Homepage/HighLightText";
import CustomButton from "../components/core/Homepage/Button"
import CodeBlocks from "../components/core/Homepage/CodeBlocks";
import LearningLanguageSection from "../components/core/Homepage/LearningLanguageSection"
import TimeLineSection from "../components/core/Homepage/TimeLineSection";
import InstructorSection from "../components/core/Homepage/InstructorSection";
import ReviewSlider from "../components/core/Homepage/ReviewSlider";
import ExploreMore from "../components/core/Homepage/ExploreMore";
/* importing media files */
import banner from "../assets/Images/banner.mp4"
import Footer from "../components/Common/Footer";

function Home() {
  return (
    <div>
        {/* section 1 */}

        <div className="relative mx-auto flex flex-col w-11/12 max-w-max-content items-center text-white justify-between gap-8">

            <Link to ={"/signup"}>
                <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                    <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] 
                    transition-all duration-200 group-hover:bg-richblack-900">
                        <p>Become an Instructor</p>
                        <FaArrowRight />

                    </div>
                </div>
            </Link>

            {/* heading */}
            <div className="text-center text-4xl font-semibold mt-7">
                Empower Your Future with
                <HighLightText text={"Coding Skills"} />
            </div>

            {/* subheading */}
            <div className="w-[90%] text-center text-bold text-lg text-richblack-300 -mt-3">
                With our online coding courses, you can learn at your own pace, from
                anywhere in the world, and get access to a wealth of resources,
                including hands-on projects, quizzes, and personalized feedback from
                instructors.
            </div>

            <div className="flex flex-row gap-7 mt-8">
                <CustomButton active={true} linkto={"/signup"}>Learn More</CustomButton>
                <CustomButton active={false} linkto={"/login"}>Book a Demo</CustomButton>
            </div>

            <div className="shadow-blue-200 mx-3 my-12 shadow-[10px_-5px_50px_-5px]">
                <video
                className="shadow-[20px_20px_rgba(255,255,255)]"
                muted loop autoPlay
                >
                    <source src={banner} type="video/mp4"></source>
                </video>
            </div>

            {/* code section 1 */}

            <div>
                <CodeBlocks 

            position={"lg:flex-row md:flex-row sm:flex-col"}
            heading={
                <div className="text-4xl font-semibold">
                    Unlock Your
                    <HighLightText text={"coding potential"} />
                    with our online course
                </div>
            }

            subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }

            cbutton1={
                {
                    btnText: "Try it yourself",
                    linkto:"/signup",
                    active: true,
                }
            }

            cbutton2={
                {
                    btnText: "Learn More",
                    linkto:"/login",
                    active: false,
                }
            }
            codeColor={"text-yellow-25"}
            codeblock={
                `<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`
            }
            backgroundGradient={"grad"}

                ></CodeBlocks>
            </div>

            {/* code section 2 */}
             <div>
                <CodeBlocks 

            position={"lg:flex-row-reverse md:flex-row-reverse sm:flex-col"}
            heading={
                <div className="text-4xl font-semibold w-[100%] lg:w-[50%]">
                    Start
                    <HighLightText text={"coding in seconds"} />
                </div>
            }

            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }

            cbutton1={
                {
                    btnText: "Continue Lesson",
                    linkto:"/signup",
                    active: true,
                }
            }

            cbutton2={
                {
                    btnText: "Learn More",
                    linkto:"/login",
                    active: false,
                }
            }
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`
            }

            backgroundGradient={"grad2"}

                ></CodeBlocks>
            </div>

            <ExploreMore />

            </div>

            {/* section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-[320px] ">
                    <div className="w-11/12 max-w-max-content flex flex-col items-center justify-between gap-8 mx-auto">
                        <div className="h-[150px]"></div>
                        <div className="flex flex-row gap-7 text-white">
                            <CustomButton active={true} linkto={"/signup"}>
                                <div className="flex items-center gap-3">
                                    Explore full catalog
                                    <FaArrowRight/>
                                </div>
                            </CustomButton>

                            <CustomButton active={false} linkto={"/signup"}>
                                <div className="">Learn More</div>
                            </CustomButton>
                        </div> 
                    </div>
                </div>

                <div className="mx-auto flex w-11/12 max-w-max-content flex-col items-center justify-between gap-8 ">
                    
                    <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                        <div className="text-4xl font-semibold lg:w-[45%]">
                            Get the skills you need for a 
                            <HighLightText text={"job that is in demand"} />
                        </div>
                        <div className="flex flex-col gap-10 w-[40%] items-start">
                        <div className="text-[16px]">
                            The modern Skillify is the dictates its own terms. Today, to
                            be a competitive specialist requires more than professional
                            skills.
                        </div>
                        <div>
                        <CustomButton active={true} linkto={"/signup"}>Learn More</CustomButton>
                        </div>
                    </div>
                    </div>

                    <TimeLineSection />
                    <LearningLanguageSection />
                </div>
            </div>


            {/* section 3 */}
            <div className="w-11/12 mx-auto max-w-max-content flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                <InstructorSection></InstructorSection>

                <h2 className="text-center text-4xl font-semibold mt-10 ">Review from Other Learners</h2>
                <ReviewSlider />
            </div>


            {/* footer */}
            <Footer />
        </div>
  )
}

export default Home