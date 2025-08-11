import React, { useEffect, useState } from 'react'
import Footer from '../components/Common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../Services/apiConnector';
import { categories } from '../Services/apis';
import { categoryPageDetails } from '../Services/operations/categoryAPI';
import CourseCard from '../components/core/Catalog/CourseCard';
import CourseSlider from '../components/core/Catalog/CourseSlider';

function Catalog() {

    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState("")

    //fetch data
    useEffect(() => {

        const getCategory = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            res.data.allCategory.map((single_Category) => {
                const name =  single_Category.name.split(" ").join("-").toLowerCase();

                if(name === catalogName){
                    setCategoryId(single_Category._id);
                }
            });
        }

        getCategory();

    }, [catalogName]);

    useEffect(() =>{

        const getCategoryDetails = async() => {
            
            if(categoryId){
                try {
                const res = await categoryPageDetails(categoryId);
                setCatalogPageData(res);
            } catch (error) {
                console.log(error);
            }
            }
        }

        getCategoryDetails();
    }, [categoryId]);

  return (
    <div>

       {/* Hero Section */}
       <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">
                {`Home / catalog / `}
                <span className="text-yellow-25"> 
                {catalogPageData?.selectedCourse?.name}  
                </span>

                </p>

                <p className="text-3xl text-richblack-5"> 
                    {catalogPageData?.selectedCourse?.name} 
                </p>

                <p className="max-w-[870px] text-richblack-200"> 
                    {catalogPageData?.selectedCourse?.description}  </p>
            </div>
       </div>

       <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-max-content">
            {/* section1 */}
                <div className="section_heading">Courses to get you started</div>

                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                     className={`px-4 py-2 ${
                        active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                        } cursor-pointer`}
                    onClick={() => setActive(1)}
                    >Most Popular</p>

                    <p
                    className={`px-4 py-2 ${
                        active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                        } cursor-pointer`}
                    onClick={() => setActive(2)}
                    >New</p>
                </div>

                <CourseSlider 
                    Courses = {catalogPageData?.selectedCourse?.courses}
                />


            {/* section 2 */}
            <div className=" mx-auto box-content w-full max-w-max-content-tab px-4 py-12 lg:max-w-max-content">
                <div className="section_heading">Top courses</div>
                <p>Top Courses</p>
                <div className="py-8">
                    <CourseSlider 
                    Courses = {catalogPageData?.differentCourses}
                    />
                </div>
            </div>

            {/* section 3 */}
            <div className=" mx-auto box-content w-full max-w-max-content-tab px-4 py-12 lg:max-w-max-content">
                <div className="section_heading">Frequently Bought</div>

                <div className='py-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {
                            catalogPageData?.mostSellingCourses?.slice(0, 4)
                            .map((course, index) => {
                                return (
                                    <CourseCard 
                                        course = {course} key={index}
                                        height = {"h-400px"}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
       </div>

       <Footer />
    </div>
  )
}

export default Catalog