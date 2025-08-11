import { logout } from "./authAPI";
import { apiConnector } from "../apiConnector";
import { setLoading, setUser } from "../../Slices/profileSlice";
import { Profile_Endpoints } from "../apis";
import { toast } from "react-toastify";
import { endpoint } from "../apis";
import { setToken } from "../../Slices/authSlice";

export  function getUserEnrolledCourses(){
    return async(dispatch) => {
        
        let result = [];
        try {
            const response = await apiConnector("GET", Profile_Endpoints.ENROLLED_COURSES_API)
            console.log("GET_USER_ENROLLED_COURSES_API response:", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            result = response.data.data;
        } catch (error) {
            console.error("GET_USER_ENROLLED_COURSES_API ERROR............", error);
            result = [];
        } finally{

            
        }

        return result;
    }
}

export function changeProfilePicture(file, setfile){
    return async (dispatch) => {
        const toasId = toast.loading("Uploading...");

        try {
            const formData = new FormData();
            formData.append("displayPicture", file);
            const response = await apiConnector("PUT", Profile_Endpoints.UPDATE_DISPLAY_PICTURE_API, formData);
            console.log(response.data.data);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            localStorage.setItem("user", JSON.stringify(response.data.data));
            dispatch(setUser(JSON.parse(localStorage.getItem("user"))));

            setfile(null);
            toast.success("Profile Picture Changed Successfully");
       
        } catch (error) {
            //console.log("Uploading image error: ", error);
            toast.error("Profile Picture Upload Failed, Try again later");
        }

        toast.dismiss(toasId);

    }
}

export function updateProfile(data){
    const toastId = toast.loading("Loading...");

    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PUT", Profile_Endpoints.UPDATE_PROFILE_API, data);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            localStorage.setItem("user", JSON.stringify(response.data.data));
            dispatch(setUser(response.data.data));
            console.log(response.data.data);

            toast.success("Profile Updated Successfully");

            
        } catch (error) {
            //console.log("Error updating profile: ", error);
            toast.error("Failed to upload profile details");
        } finally{
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
};

export function changePassword(data){
    const toastId = toast.loading("Loading...");

    return async(dispatch) => {
        try {
            const response = await apiConnector("POST", endpoint.CHANGEPASSWORD_API, data);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Password Changed Successfully");
        } catch (error) {
            //console.log(error);
            toast.error("Failed to update password");
        }
        toast.dismiss(toastId);
    }
};

export function deleteProfile(token, navigate){
    const toastId = toast.loading("Loading...");

    return async (dispatch) => {
        try {
            const response = await apiConnector("DELETE", Profile_Endpoints.DELETE_PROFILE_API, token);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch(setUser(null));
            dispatch(setToken(null));
            toast.success("Account Deleted Successfully");
            navigate("/");
        } catch (error) {
            //console.log(error);
            toast.error("FAiled to delete profile");
        }
        toast.dismiss(toastId);
    }
};


export const instructorDashboardData = async() => {
    const toasId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector("GET", Profile_Endpoints.INSTRUCTOR_DASHBOARD_API,);

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.data;
    } catch (error) {
        console.log("Instructor dashboard error: ", error);
        toast.error(error.message);
        result = null;
    }
    toast.dismiss(toasId);
    return result;
};