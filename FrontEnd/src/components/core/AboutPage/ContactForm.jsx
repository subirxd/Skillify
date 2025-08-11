import React from 'react'
import ContactUSForm from '../../Common/ContactUSForm'

function ContactForm() {
  return (
    <div className='mx-auto max-w-max-content'>
        <h1 className="text-center text-4xl font-semibold">
            Get in touch
        </h1>
        <p className="text-center text-richblack-300 mt-3">
            We'd love to hear you, Please fill the from below.
        </p>

        <div className="mt-12 mx-auto">
            <ContactUSForm />
        </div>
    </div>
  )
}

export default ContactForm