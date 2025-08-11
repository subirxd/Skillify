import { apiConnector } from "../apiConnector";
import { review_Endpoints } from "../apis";

export const getAllReviews = async() => {
    let result;
    try {
        const response = await apiConnector("GET", review_Endpoints.GET_ALL_REVIEWS);
        
        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.data;
    } catch (error) {
        console.log(error);
        result = null;
    }

    return result;
}