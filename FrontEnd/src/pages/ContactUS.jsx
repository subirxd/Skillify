import React from 'react';

import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { BiWorld } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import Footer from '../components/Common/Footer';
import ContactUSForm from '../components/Common/ContactUSForm';

function ContactUS() {
  return (
    <div>
      
      <div className="mx-auto mt-20 flex w-11/12 max-w-max-content flex-col justify-between gap-10 text-white lg:flex-row">

        {/* Contact Information Section */}
        <div className='lg:w-[40%]'>

          <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
            {/* Chat on us */}
            <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
              <div className="flex flex-row items-center gap-3">
                <HiChatBubbleLeftRight />
                <p className="text-lg font-semibold text-richblack-5">Chat on us</p>
              </div>
              <p className="font-medium">Our friendly team is here to help.</p>
              <a href='mailto:subirm261@gmail.com' className="text-blue-300 hover:underline">subirm261@gmail.com</a>
            </div>

            {/* Visit us */}
            <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
              <div className="flex flex-row items-center gap-3">
                <BiWorld />
                <p className="text-lg font-semibold text-richblack-5">Visit us</p>
              </div>
              <p className="font-medium">Come and say hello at our office HQ.</p>
              <p className="font-medium">ABC Block, XYZ Road, DEF City, pin- 111111</p>
            </div>

            {/* Call us */}
            <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
              <div className="flex flex-row items-center gap-3">
                <IoCall />
                <p className="text-lg font-semibold text-richblack-5">Call us</p>
              </div>
              <p className="font-medium">Mon - Fri From 8am to 5pm</p>
              <p className="font-medium">+123 456 7869</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:w-[60%]">
          <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
            <p className="text-4xl leading-10 font-semibold text-richblack-5">Got a Idea? We've got the skills. Let's team up</p>
            <p>Tell us more about yourself and what you're got in mind.</p>

            <div className='mt-7'>
              <ContactUSForm />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <Footer />
      </div>
    </div>
  );
}

export default ContactUS;