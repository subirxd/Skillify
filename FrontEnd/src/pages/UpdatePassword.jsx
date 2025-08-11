import React, { useState } from 'react'
import { setLoading } from '../Slices/authSlice'
import { useSelector } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { passwordReset } from '../Services/operations/authAPI'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function UpdatePassword() {
    const {loading} = useSelector((state) => state.auth);
    const [passwordHide, setPasswordHide] = useState(true);
    const [confirmPasswordHide, setConfirmPasswordHide] = useState(true);
    const [formData, setFormData] = useState({password:"", confirmPassword: ""});
    const {token} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleOnChange(e){
        setFormData((prevData) => {
           return {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        } );
    };

    function handleSubmit(e){
        e.preventDefault();
        dispatch(passwordReset(formData, token, navigate));
    }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading ? (<div className='spinner'></div>) : 
            (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1  className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">Choose new Password</h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">Almost done, Enter your password and you're all set.</p>
                    <form onSubmit={handleSubmit}>
                        <label className='relative'>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            New Password<sup className="text-pink-200" >*</sup></p>
                            <input
                            required
                            type= {passwordHide ? "password" : "text"}
                            name='password'
                            value={formData.password}
                            onChange={handleOnChange}
                            className="form-style w-full !pr-10"
                             />
                            <span 
                             className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            onClick={() => setPasswordHide(!passwordHide)}>
                                {
                                    passwordHide ? <AiOutlineEye fontSize={24} fill="#AFB2BF"   /> : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"   />
                                }
                            </span>
                        </label>
                        <label className="relative mt-3 block">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            New Password<sup className="text-pink-200">*</sup></p>
                            <input
                            required
                            type= {confirmPasswordHide ? "password" : "text"}
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleOnChange}
                            className="form-style w-full !pr-10"
                             />
                            <span 
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            onClick={() => setConfirmPasswordHide(!confirmPasswordHide)}>
                                {
                                    confirmPasswordHide ? <AiOutlineEye fontSize={24} fill="#AFB2BF"  /> 
                                    : <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"  />
                                }
                            </span>
                        </label>

                        <button
                        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 cursor-pointer"
                         type='submit'>
                            Submit
                        </button>
                    </form>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword