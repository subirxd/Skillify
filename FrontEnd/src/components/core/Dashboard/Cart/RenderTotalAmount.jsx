import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '../../../Common/IconButton';
import { buyCourse } from '../../../../Services/operations/studentAPI';
import { resetCart } from '../../../../Slices/cartSlice';
import { useNavigate } from 'react-router-dom';


function RenderTotalAmount() {
    const {total, cart} = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);

    const handleBuyCourse = async() => {
        const courses = cart.map((course) => course._id);
       try {
        const res = await buyCourse(courses, token, user, navigate, dispatch);
        
        if(res.data.success){
          dispatch(resetCart());
          navigate("/dashboard/enrolled-courses");
        }

       } catch (error) {
        console.log(error);
       }
        return;
    }
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
        <p className="mb-6 text-3xl font-medium text-yellow-100"> ₹ {total} </p>

        <IconButton
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses={"w-full justify-center"}
         />
    </div>
  )
}

export default RenderTotalAmount