import {apiConnector} from "../apiConnector"
import { student_Endpoints } from "../apis"
import {toast} from "react-toastify"
import razorpayLogo from "../../assets/Logo/logo.png"
import { resetCart } from "../../Slices/cartSlice"

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () =>{
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export const buyCourse = async(courses, token, userDetails, navigate, dispatch) => {

    const toastId = toast.loading("Loading...");

    try {
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("Razorpay SDK failed to load");
        }

        //order initialize
        const OrderResponse = await apiConnector("POST", student_Endpoints.CAPTURE_PAYMENT, 
                                                                    {courses}, {
                                                                        Authorization: `Bearer ${token}`
                                                                    });
        
        console.log(OrderResponse);
        if(!OrderResponse.data.success){
            throw new Error(OrderResponse.data.message);
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: OrderResponse.data.data.currency,
            amount: OrderResponse.data.data.price,
            order_id: OrderResponse.data.data.id,
            name: "Skillify",
            description: "Thank You For Purchasing Course",
            image: razorpayLogo,
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email,

            },
            handler: function(razorpayResponse){
                //send successful mail
                sendPaymentSuccessEmail(razorpayResponse, OrderResponse.data.data.amount, token);
                //verify payment
                verifyPayment({...razorpayResponse, courses}, token, navigate, dispatch)
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response){
            toast.error("Oops, payment failed.");
            console.log(error);
        })
    } catch (error) {
        console.log("Payment APi error:", error);
        toast.error("Could not make payment");
    } finally{
        toast.dismiss(toastId);
    }
}

async function sendPaymentSuccessEmail(response, amount, token){
    try {
            await apiConnector("POST", student_Endpoints.SEND_PAYMENT_SUCCESS_EMAIL, {
            orderId : response.razorpay_order_id,
            paymentId : response.razorpay_payment_id,
            amount,
        }, {
            Authorization : `Bearer ${token}`
        })
    } catch (error) {
        console.log("Payment success email error: ", error);

    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    //dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector("POST", student_Endpoints.VERIFY_PAYMENT, bodyData, {
            Authorization: `Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Payment Successful, You're added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("Payment verify error: ", error);
        toast.error("Could not verify payment");
    } finally{
        toast.dismiss(toastId);
        //dispatch(setPaymentLoading(false));
    }
}