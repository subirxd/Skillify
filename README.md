# Skillify: An EdTech Platform
Skillify is a full-stack, single-page application designed as a comprehensive course management system. It provides a platform for instructors to create, manage, and sell their courses, and for students to enroll in them, track their progress, and make secure payments.

# Features
User Authentication: Secure login, signup, and logout functionalities with JWT and cookie-based authentication.

Role-Based Access: Differentiated dashboards and features for instructors and students.

# Instructor Dashboard:
Create, edit, and delete courses with multi-step forms.

Manage course content, including sections and subsections.

View course analytics, total students, and total income.

Visualize data with dynamic charts (students vs. income).

# Student Functionality:

Browse and discover a wide range of courses.

Add courses to a cart and manage cart items.

Secure payment processing via Razorpay integration.

Enroll in and track course progress.

# Profile Management: 
Users can update their profile details, change their password, and upload a profile picture.

# File Uploads: 
Integration with Cloudinary for handling and storing course thumbnails and user profile pictures.

# Responsive UI: 
A sleek, consistent dark-themed interface built with Tailwind CSS.

# Tech Stack
# Frontend
 React: A JavaScript library for building user interfaces.

Redux Toolkit: For efficient and predictable state management.

React Router DOM: For client-side routing.

React Hook Form: For robust and performant form management and validation.

Chart.js: For data visualization on the instructor dashboard.

Tailwind CSS: For rapid UI development with utility-first CSS.

Razorpay SDK: For handling secure payment transactions.

# Backend
Node.js & Express: The runtime environment and framework for the backend API.

MongoDB & Mongoose: For a flexible, NoSQL database and an elegant object data modeling library.

JWT (JSON Web Tokens): For secure, stateless authentication.

Bcrypt: For password hashing and security.

Express-fileupload: Middleware for handling multipart/form-data and file uploads.

Cloudinary SDK: For cloud-based image and video storage.

# Prerequisites
Before running the project, ensure you have the following installed:

Node.js (v18 or higher)

npm (Node Package Manager)

MongoDB Atlas or a local MongoDB instance

# Installation & Setup
Clone the repository:

git clone https://github.com/subirxd/skillify.git

cd your-project
Set up the Frontend:

# Install dependencies
npm install

# Create a .env file in the frontend root
touch .env

# Add your environment variables
VITE_RAZORPAY_KEY=your_razorpay_test_key
VITE_BACKEND_URL=http://localhost:4000/api/v1

# Start the development server
npm run dev
Set up the Backend:

Bash

# Navigate to the backend directory
cd BackEnd

# Install dependencies
npm install

# Create a .env file in the backend root
touch .env

# Add your environment variables
PORT=4000

MONGO_URL=your_mongodb_connection_string.

JWT_SECRET=your_jwt_secret_key.

RAZORPAY_KEY_ID=your_razorpay_key_id.

RAZORPAY_SECRET=your_razorpay_secret.

FOLDER_NAME=your_cloudinary_folder_name.

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name.

CLOUDINARY_API_KEY=your_cloudinary_api_key.

CLOUDINARY_API_SECRET=your_cloudinary_api_secret.

# Start the backend server
npm start
The application should now be running on http://localhost:3000 (frontend) and http://localhost:4000 (backend).
