import { useState } from "react"
import { toast } from "react-toastify"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { setSignupData, setLoading } from "../../../Slices/authSlice";
import { sendOTP } from "../../../Services/operations/authAPI";


function SignupForm() {
    const navigate = useNavigate();
    const {signupData, loading} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

      // student or instructor
      const [accountType, setAccountType] = useState("student");

      const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      const { firstName, lastName, email, password, confirmPassword } = formData

      // Handle input fields, when some value changes
      const handleOnChange = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          [e.target.name]: e.target.value,
        }))
      }

      // Handle Form Submission
      const handleOnSubmit = (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
          toast.error("Passwords Do Not Match")
          return
        }
        const signupDatas = {
          ...formData,
          accountType,
        }

        dispatch(setSignupData(signupDatas));
        dispatch(sendOTP(email, navigate));
      }


      return (
        <div>

          {/* student-Instructor tab */}
            <div
            className='flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max'>

                <button
                className={`${accountType === "student" 
                ?
                  "bg-richblack-900 text-richblack-5"
                :"bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                onClick={()=> setAccountType("student")}>
                    Student
                </button>

                <button
                className={`${accountType === "instructor" 
                ?
                  "bg-richblack-900 text-richblack-5"
                :"bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                onClick={() => setAccountType("instructor")}>
                    Instructor
                </button>
            </div>

          {/* Form */}
          <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4 my-6">
            <div className="flex gap-x-4">
              <label>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  First Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleOnChange}
                  placeholder="Enter first name"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                />
              </label>
              <label>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Last Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleOnChange}
                  placeholder="Enter last name"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                />
              </label>
            </div>
            <label className="w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Email Address <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type="text"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter email address"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              />
            </label>
            <div className="flex gap-x-4">
              <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Create Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Enter Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
              <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Confirm Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 cursor-pointer"
            >
              Create Account
            </button>
          </form>
        </div>
    )
  }

  export default SignupForm