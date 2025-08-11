import React, { useEffect, useState } from 'react'
import {useForm} from "react-hook-form"
import { apiConnector } from '../../Services/apiConnector';

import { contactUS } from '../../Services/apis';
import countrycode from "../../data/countrycode.json"

const api = contactUS.CONTACTUS_API;

function ContactUSForm() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitSuccessful}
    } = useForm();

    useEffect( () => {
        if(isSubmitSuccessful){
        reset({
            email:"",
            firstName:"",
            lastName:"",
            message:"",
            phoneNo: "",
            countryCode: "+91",
        })
    }
    }, [ reset ,isSubmitSuccessful]);


    const submitContactForm = async(data) => {
        console.log("Logging Data: ", data);
        try {
            setLoading(true);
            const response = await apiConnector("POST", api, data);
            console.log("Logging response: ", response);
        } catch (error) {
            console.log("Error: ", error.message);
        }
        setLoading(false);
    }


  return (
    <div>
            <form 
                onSubmit={handleSubmit(submitContactForm)}
                className="flex flex-col gap-7 bg-gradient-dark p-6 rounded-xl shadow-lg"
                >
                {/* First + Last Name */}
                <div className="flex flex-col gap-5 lg:flex-row">
                    {/* First Name */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstName" className="text-accent font-semibold">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter your first name"
                        className="form-style bg-richblack-800 border border-richblack-600 rounded-md px-4 py-2 focus:border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                        <span className="text-yellow-200 text-sm">Please enter your First Name</span>
                    )}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastName" className="text-accent font-semibold">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter your last name"
                        className="form-style bg-richblack-800 border border-richblack-600 rounded-md px-4 py-2 focus:border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                        {...register("lastName", { required: true })}
                    />
                    {errors.lastName && (
                        <span className="text-yellow-200 text-sm">Please enter your Last Name</span>
                    )}
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-accent font-semibold">Email</label>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="form-style bg-richblack-800 border border-richblack-600 rounded-md px-4 py-2 focus:border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                    {...register("email", { required: true })}
                    />
                    {errors.email && (
                    <span className="text-yellow-200 text-sm">Please enter your Email</span>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="phoneNo" className="text-accent font-semibold">Phone Number</label>
                    <div className="flex gap-3">
                    {/* Country Code */}
                    <select
                        name="countryCode"
                        id="countryCode"
                        className="form-style bg-richblack-800 border border-richblack-600 rounded-md px-3 py-2 focus:border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                        {...register("countryCode", { required: true })}
                    >
                        {countrycode.map((ele, index) => (
                        <option key={index} value={ele.code} selected={ele.code === "+91"}>
                            {ele.code} - {ele.country}
                        </option>
                        ))}
                    </select>

                    {/* Phone Number */}
                    <input
                        type="tel"
                        name="phoneNo"
                        id="phoneNo"
                        placeholder="12345 67890"
                        className="form-style bg-richblack-800 border border-richblack-600 rounded-md px-4 py-2 flex-1 focus:border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                        {...register("phoneNo", { required: true })}
                    />
                    </div>
                    {errors.phoneNo && (
                    <span className="text-yellow-200 text-sm">Please enter your Phone Number</span>
                    )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-accent font-semibold">Message</label>
                    <textarea
                    name="message"
                    id="message"
                    placeholder="Enter your message"
                    rows="5"
                    className="form-style bg-richblack-800 border border-richblack-600 rounded-md px-4 py-3 focus:border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                    {...register("message", { required: true })}
                    />
                    {errors.message && (
                    <span className="text-yellow-200 text-sm">Please write a message for us</span>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`btn btn-primary w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-lg shadow-lg ${
                    !loading && "hover:scale-95 hover:shadow-none"
                    }`}
                >
                    {loading ? "Sending..." : "Submit"}
                </button>
            </form>

        </div>
    )
}

export default ContactUSForm