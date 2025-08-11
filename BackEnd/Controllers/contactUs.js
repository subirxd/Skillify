import mailSender from "../Utils/mailSender.js";
import { contactUsEmail } from "../mail/template/contactFormRes.js";
import { contactUsEmailOwn } from "../mail/template/contactFormResOwner.js";

export async function contactUS(req, res) {
    try {
        const { firstName, lastName, email, phoneNo, message, countryCode } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !phoneNo || !message || !countryCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Send emails
        const userResponse = await mailSender(
            email,
            "Contact Form Confirmation",
            contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
        );

        const ownerResponse = await mailSender(
            "subirm261@gmail.com",
            "Contact Us Response",
            contactUsEmailOwn(email, firstName, lastName, message, phoneNo, countryCode)
        );

        // Sanitize user response
        const userResponseCopy = {
            accepted: userResponse.accepted,
            rejected: userResponse.rejected,
            response: userResponse.response,
        };

        // Send final response
        return res.status(200).json({
            success: true,
            message: "Form submitted successfully.",
            userResponse: userResponseCopy,
        });

    } catch (error) {
        console.log("Error while submitting form data:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later.",
            error,
        });
    }
};