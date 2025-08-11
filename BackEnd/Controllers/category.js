import { CategoryModel } from "../Models/category.js";
import { CourseModel } from "../Models/course.js";

//create category handler function
export async function createCategory(req, res) {
    try {
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const categoryDetails = await CategoryModel.create({name, description});
        
        return res.status(200).json({
            success: true,
            message: "Category created successfully."
        });
    } catch (error) {
        console.log("Error While Creating category: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//fetch all the category
export async function showAllCategory(req, res) {
    try {
        const allCategory = await CategoryModel.find({}, {name: true, description:true});
        
        return res.status(200).json({
            success: true,
            message:"All category returned successfully.",
            allCategory,
        });

    } catch (error) {
        console.log("Error While Fetching category: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export async function categoryPageDetails(req, res) {
  try {
      const { categoryId } = req.body;

      // Get courses for the specified category
      const selectedCategory = await CategoryModel.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" }, // Only published courses
          populate: [
            { path: "instructor" },
            { path: "ratingAndReviews" }
          ]
        })
        .exec();
      // Handle the case when the category is not found
      if (!selectedCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found." });
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        });
      }

      // Get courses for other categories
      const categoriesExceptSelected = await CategoryModel.find({
        _id: { $ne: categoryId }
      }).populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor" },
          { path: "ratingAndReviews" }
        ]
      }).exec();

      let differentCourses = [];
      for (const category of categoriesExceptSelected) {
        differentCourses.push(...category.courses);
      }

      // Get top-selling courses across all categories
      const allCategories = await CategoryModel.find().populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor" },
          { path: "ratingAndReviews" }
        ]
      }).exec();

      const allCourses = allCategories.flatMap((category) => category.courses);
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);

      res.status(200).json({
        selectedCourses: selectedCategory,
        differentCourses: differentCourses,
        mostSellingCourses: mostSellingCourses,
        success: true,
      });
	} catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
	}
};


export async function addCourseToCategory(req, res) {
  try {
      const { courseID, categoryID } = req.body;

      if (!courseID || !categoryID) {
        return res.status(400).json({
          success: false,
          message: "Please provide all the details."
        });
      }

      const course = await CourseModel.findById(courseID);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course details not found."
        });
      }

      const category = await CategoryModel.findById(categoryID);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category details not found."
        });
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryID,
        {
          $push: { courses: courseID } 
        },
        { new: true } 
      );

      return res.status(200).json({
        success: true,
        message: "Course added to the category.",
        data: updatedCategory,
      });

  } catch (error) {
      console.log("Error while adding course to category section: ", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong, please try again later."
      });
  }
};
