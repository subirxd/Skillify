import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineUpload } from "react-icons/ai";
import IconButton from '../../../Common/IconButton';
import { changeProfilePicture } from '../../../../Services/operations/profileAPI';


function ChangeProfilePicture() {
    const {user} = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
    }

    const  handleFileUpload = async () => {
    dispatch(changeProfilePicture(file, setFile));

    }
    
  return (
    <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5'>
       <div className="flex items-center gap-x-4">
             {/* left div */}
                <div >
                    <img
                    src = {user?.image}
                    className="aspect-square w-[78px] rounded-full object-cover"
                    />
                </div>

                <div className='flex flex-col space-y-2'>
                    <p>Change Profile Picture</p>
                    <div className='flex flex-row gap-3'>
                        <label htmlFor='picture'
                        className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                        > {file ? file.name : "Select"}
                        <input
                            name='picture'
                            id='picture'
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        </label>

                        <IconButton
                        text={loading ? "Uploading..." : "Upload"}
                        onclick={handleFileUpload}
                        disabled={loading}
                        >
                            {!loading && (
                                <AiOutlineUpload className='text-lg text-richblack-900' />
                            )}
                        </IconButton>
                    </div>
                </div>
       </div>
    </div>
  )
}

export default ChangeProfilePicture