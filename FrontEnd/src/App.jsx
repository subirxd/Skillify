import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { ACCOUNT_TYPE } from './utils/constants'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Navbar from './components/Common/Navbar'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import AboutUs from './pages/AboutUs'
import ContactUS from './pages/ContactUS'
import Dashboard from './pages/Dashboard'
import MyProfile from './components/core/Dashboard/MyProfile'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import OpenRoute from './components/core/Auth/OpenRoute'
import Error from './pages/Error'
import EnrolledCourse from './components/core/Dashboard/EnrolledCourse'
import Cart from "./components/core/Dashboard/Cart/index"
import Settings from "./components/core/Dashboard/Settings/Index"
import MyCourses from './components/core/Dashboard/InstructorCourse/MyCourses'
import AddCourse from "./components/core/Dashboard/AddCourse/index"
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse'
import Catalog from './pages/Catalog'
import CourseDetails from './pages/CourseDetails'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import InstructorDashboard from './components/core/Dashboard/InstructorCourse/InstructorDashboard'

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/catalog/:catalogName" element={<Catalog/>}></Route>
      <Route path ="signup" element ={<OpenRoute> <SignUp /> </OpenRoute>} />
      <Route path="login" element={<OpenRoute>  <Login /> </OpenRoute>} />
      <Route path="forgot-password" element={<OpenRoute> <ForgotPassword />  </OpenRoute>} />
      <Route path="update-password/:token" element={<OpenRoute> <UpdatePassword /> </OpenRoute>} />
      <Route path="verify-email" element={<OpenRoute> <VerifyEmail /> </OpenRoute>} />
      <Route path = "courses/:courseId" element={<CourseDetails />} />

      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<ContactUS />} />

      <Route  element={<PrivateRoute> <Dashboard /> </PrivateRoute>}>
      
      <Route path='dashboard/my-profile' element={<MyProfile />} />
      <Route path="dashboard/settings" element={<Settings />} />
      

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
            <Route path="dashboard/enrolled-courses" element={<EnrolledCourse />} />
            <Route path="dashboard/cart" element={<Cart />} />
          </>
        )
      }

      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
            <Route path="dashboard/my-courses" element ={<MyCourses />} /> 
            <Route path="dashboard/add-course" element ={<AddCourse />} /> 
            <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
            <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
          </>
        )
      }

      </Route>

      <Route  element={<PrivateRoute>
              <ViewCourse />
      </PrivateRoute>}>

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (

          <>
            <Route path='/view-course/:courseId/section/:sectionId/sub-section/:subSectionId' element={<VideoDetails />} />
          </>
        )
      }

      </Route>
      
      
      
      <Route path="*" element={<Error />} />

    </Routes>
    </div>
  )
}

export default App
