import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const URL = process.env.MONGODB_URL;
export function connect(){
    mongoose.connect(URL, {})
    .then(() => {
        console.log("Database Connected Successfully")
    })
    .catch((error) => {
        console.log("Db connection failed");
        console.error(error);
        process.exit(1);
    });
}