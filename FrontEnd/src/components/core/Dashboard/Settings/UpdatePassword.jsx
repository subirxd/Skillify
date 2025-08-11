import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../../../Services/operations/profileAPI';
import IconButton from '../../../Common/IconButton';

function UpdatePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, 
    getValues, 
  } = useForm();

  const updatePassword = (data) => {

    dispatch(changePassword(data));
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(updatePassword)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
          <div className="flex flex-col gap-5 lg:flex-row">

            {/* Current Password Field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldPassword" className="lable-style">
                Current Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>

            {/* New Password Field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="lable-style">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"} // Corrected state var name
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register("newPassword", {
                  required: true,
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)} // Corrected state var name
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? ( // Corrected state var name
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.newPassword.message || "Please enter your New Password."}
                </span>
              )}
            </div>
          </div> {/* End of flex row for passwords */}

          {/* --- ADD THIS NEW CONFIRM PASSWORD FIELD --- */}
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="confirmNewPassword" className="lable-style">
                Confirm New Password
              </label>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="Confirm New Password"
                className="form-style"
                {...register("confirmNewPassword", {
                  required: true,
                  validate: (value) =>
                    value === getValues("newPassword") || "Passwords do not match",
                })}
              />
              <span
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.confirmNewPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.confirmNewPassword.message || "Please confirm your New Password."}
                </span>
              )}
            </div>
          </div>
          {/* --- END NEW CONFIRM PASSWORD FIELD --- */}

        </div> {/* End of form section */}

        <div className="flex justify-end gap-2">
          <button
          type='button'
            onClick={() => {
              navigate("/dashboard/my-profile"); // This will now work
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconButton type="Submit" text="Update" />
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;