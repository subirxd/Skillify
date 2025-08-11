import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link} from "react-router-dom"
import { getPasswordResetToken } from '../Services/operations/authAPI';
import {BiArrowBack} from "react-icons/bi"

function ForgotPassword() {
    const {loading} = useSelector((state) => state.auth);
    const [emailSend, setEmailSend] = useState(false);
    const [emailID, setEmailID] = useState("");
    const dispatch = useDispatch();

    function submitHandler(e){
        e.preventDefault();
        dispatch(getPasswordResetToken(emailID, setEmailSend))
    }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading ? (
                <div className='spinner'></div>
            ) : 
            (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">{
                        !emailSend ? "Reset Your password" : "Check your email"
                    }</h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        {
                            !emailSend ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                                     : `We have sent the reset email to ${emailID}`
                        }
                    </p>
                    <form onSubmit={submitHandler}>
                        {
                            !emailSend && (
                                <label className="w-full">
                                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    Email address <sup className="text-pink-200">*</sup></p>
                                    <input
                                    required
                                    type='email'
                                    name='email'
                                    value={emailID}
                                    onChange={(e) => setEmailID(e.target.value)}
                                    placeholder='Enter Your email address'
                                    className="form-style w-full" 
                                    />
                                </label>
                            )
                        }

                        <button
                        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                        type='submit'>
                            {
                                !emailSend ? "Reset Password" : "Resend email"
                            }
                        </button>
                        <div className="mt-6 flex items-center justify-between">
                            <Link to={"/login"}>
                                <p className="flex items-center gap-x-2 text-richblack-5">
                                  <BiArrowBack />
                                Back to login</p>
                            </Link>
                        </div>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword