const BASE_URL = import.meta.env.VITE_BASE_URL;

export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllCategories",
    CATEGORY_PAGE_DETAILS : BASE_URL + "/course/getCategoryPageDetails",
};

export const endpoint = {
    RESETPASSWORD_TOKEN : BASE_URL+"/auth/reset-password-token",
    RESETPASSWORD_API : BASE_URL+"/auth/reset-password",
    LOGIN_API : BASE_URL+"/auth/login",
    SIGNUP_API: BASE_URL+"/auth/signup",
    OTP_API: BASE_URL+"/auth/send-otp",
    CHANGEPASSWORD_API : BASE_URL+"/auth/change-password",
}

export const contactUS = {
    CONTACTUS_API : BASE_URL + "/contactus/contact",
}

export const Profile_Endpoints = {
    USER_DETAILS_API : BASE_URL + "/profile/getUserDetails",
    UPDATE_PROFILE_API : BASE_URL + "/profile/updateProfile",
    UPDATE_DISPLAY_PICTURE_API : BASE_URL + "/profile/updateDisplayPicture",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
    ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    INSTRUCTOR_DASHBOARD_API: BASE_URL + "/profile/getInstructorDashboardDetails"
}

export const course_Endpoints = {
    INSTRUCTOR_COURSES : BASE_URL + "/course/getInstructorCourses",
    DELETE_COURSE: BASE_URL + "/course/deleteCourse",
    CREATE_COURSE: BASE_URL + "/course/createCourse",
    GET_ALL_COURSE:BASE_URL +  "/course/getAllCourses",
    EDIT_COURSE: BASE_URL + "/course/editCourse",
    GET_COURSE_DETAILS: BASE_URL + "/course/getCourseDetails",
    GET_FULL_COURSE_DETAILS: BASE_URL + "/course/getFullCourseDetails",
    SEARCH_COURSE : BASE_URL + "/course/searchCourse",
    UPDATE_COURSE_PROGRESS: BASE_URL + "/course/updateCourseProgress",
    ADD_SECTION: BASE_URL + "/course/addSection",
    UPDATE_SECTION: BASE_URL + "/course/updateSection",
    DELETE_SECTION: BASE_URL + `/course/deleteSection`,
    ADD_SUB_SECTION: BASE_URL + "/course/addSubsection",
    UPDATE_SUB_SECTION: BASE_URL + "/course/updateSubSection",
    DELETE_SUB_SECTION: BASE_URL + "/course/deleteSubSection",
    SHOW_ALL_CATEGORY: BASE_URL + "/course/showAllCategories",
    GET_CATEGORYPAGE_DETAILS: BASE_URL + "course/getCategoryPageDetails",
    ADD_COURSE_TO_CATEGORY: BASE_URL + "/course/addCourseToCategory",
    CREATE_RATING: BASE_URL + "/course/createRating"

}

export const student_Endpoints = {
    CAPTURE_PAYMENT: BASE_URL + "/payment/capturePayment",
    VERIFY_PAYMENT: BASE_URL + "/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

export const review_Endpoints = {
    GET_ALL_REVIEWS  : BASE_URL + "/course/getReviews",
}