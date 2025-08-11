import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type: String,
            required: true,
        },
        courses:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }],
    },
);

export const CategoryModel = mongoose.model("Category", categorySchema);