import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconButton from "../../Common/IconButton"
import DetailItem from "./DetailItem"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      <div className="mb-10 rounded-xl border border-richblack-700 bg-gradient-to-r from-richblack-800 to-richblack-900 p-8 shadow-lg">
  <div className="flex flex-wrap items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <img
        src={user?.image}
        alt={`profile-${user?.firstName}`}
        className="w-20 h-20 rounded-full border-2 border-richblack-600 object-cover shadow-md"
      />
      <div>
        <p className="text-xl font-semibold text-richblack-5">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-richblack-300">{user?.email}</p>
      </div>
    </div>
    <IconButton
      text="Edit"
      className="hover:scale-105 transition-transform"
      onclick={() => navigate("/dashboard/settings")}
    >
      <RiEditBoxLine size={20} />
    </IconButton>
  </div>
</div>

{/* About Section */}
<div className="my-8 rounded-xl border border-richblack-700 bg-richblack-800 p-8 shadow-md">
  <div className="flex items-center justify-between mb-4">
    <p className="text-lg font-semibold text-richblack-5">About</p>
    <IconButton
      text="Edit"
      onclick={() => navigate("/dashboard/settings")}
    >
      <RiEditBoxLine size={20} />
    </IconButton>
  </div>
  <p
    className={`text-sm font-medium ${
      user?.additionalDetails?.about
        ? "text-richblack-5"
        : "text-richblack-400 italic"
    }`}
  >
    {user?.additionalDetails?.about ?? "Write Something About Yourself"}
  </p>
</div>

{/* Personal Details */}
<div className="my-8 rounded-xl border border-richblack-700 bg-richblack-800 p-8 shadow-md">
  <div className="flex items-center justify-between mb-4">
    <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
    <IconButton
      text="Edit"
      onclick={() => navigate("/dashboard/settings")}
    >
      <RiEditBoxLine size={20} />
    </IconButton>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
    <DetailItem label="First Name" value={user?.firstName} />
    <DetailItem label="Last Name" value={user?.lastName} />
    <DetailItem label="Email" value={user?.email} />
    <DetailItem label="Phone Number" value={user?.additionalDetails?.contactNumber ?? "Add Contact Number"} />
    <DetailItem label="Gender" value={user?.additionalDetails?.gender ?? "Add Gender"} />
    <DetailItem label="Date Of Birth" value={formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"} />
  </div>
</div>

    </>
  )
}