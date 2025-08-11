import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OtpInput from "react-otp-input"
import {BiArrowBack} from "react-icons/bi"
import { RxCountdownTimer } from "react-icons/rx";
import { useNavigate, Link } from 'react-router-dom';
import { sendOTP, signUp } from '../Services/operations/authAPI';

function VerifyEmail() {
    const {loading, signupData} = useSelector((state) => state.auth);
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!signupData || Object.keys(signupData).length === 0){
            navigate("/signup");
        }
    }, [signupData, navigate]);

    function submitHandler(event){
        event.preventDefault();
        dispatch(signUp(signupData, otp, navigate));
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        {
            loading ? (
                <div className='spinner'></div>
            ) 
            : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
                        Verify Email
                    </h1>
                    <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
                        A verification code has been sent to you. Enter the code below
                    </p>
                    <form onSubmit={submitHandler}>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => (
                                <input
                                {...props}
                                placeholder="-"
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                />
                            )}
                             containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                            }}
                            />
                            <button type='submit'
                            className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900 cursor-pointer"
                            >
                                Verify Email
                            </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <div>
                            <Link to={"/login"}>
                                <BiArrowBack />
                                <p className="text-richblack-5 flex items-center gap-x-2 cursor-pointer">Back to Login</p>
                            </Link>
                        </div>
                        
                        <button className="flex items-center text-blue-100 gap-x-2 cursor-pointer"
                        onClick={() => dispatch(sendOTP(signupData.email))}
                        >
                            <RxCountdownTimer />
                            Resend OTP
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail