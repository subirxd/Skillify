import { apiConnector } from "../apiConnector";
import {toast} from "react-toastify"
import { categories } from "../apis";


export const categoryPageDetails = async(categoryId) => {
    let result = null;
    const toasId = toast.loading("Loading");

    try {
        const response = await apiConnector("POST", categories.CATEGORY_PAGE_DETAILS, {categoryId});

        if(!response?.data?.success){
            throw new Error(response.data.message);
        }
        result = {
            selectedCourse: response?.data?.selectedCourses,
            differentCourses: response?.data?.differentCourses,
            mostSellingCourses: response?.data?.mostSellingCourses,
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }finally{
        toast.dismiss(toasId);
    }
    return result;
}