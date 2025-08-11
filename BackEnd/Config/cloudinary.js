import {v2 as cloudinary} from "cloudinary"

export function cloudinaryConnect(){
    try {
         if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
            console.error("❌ Cloudinary ENV variables are missing.");
            return;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        console.log("Cloudinary Connected.");
    } catch (error) {
        console.log("Error while connecting to cloudinary DB:", error);
    }
};