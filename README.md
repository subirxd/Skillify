# Skillify: Full‑Stack EdTech Platform

Skillify is a full‑stack course platform where instructors create/manage courses and students enroll, learn, and pay securely.

## Features
- **Auth & Roles**: JWT auth, cookies, role‑based access for Student/Instructor
- **Instructor**: Create/edit/delete courses, manage sections/subsections, analytics
- **Student**: Browse, cart, purchase via Razorpay, track course progress
- **Profile**: Update details, password, and avatar
- **Uploads**: Cloudinary for thumbnails, profile pictures, and videos
- **UI**: Responsive dark theme built with Tailwind CSS

## Tech Stack
- **Frontend**: React, Redux Toolkit, React Router, React Hook Form, Chart.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, express-fileupload, Cloudinary, Razorpay

## Monorepo Scripts (root)
- `npm run dev` → runs backend and frontend together (via concurrently)
- `npm run backend` → dev server for backend (`BackEnd`)
- `npm run frontend` → dev server for frontend (`FrontEnd`)

Defined in `package.json` at the repo root.

## Prerequisites
- Node.js v18+
- npm
- MongoDB (Atlas or local)
- Cloudinary account (for media storage)
- Razorpay test account (for payments)

## Environment Variables
Create `.env` files in both `BackEnd` and `FrontEnd` with the following keys.

### Backend (`BackEnd/.env`)
Required by `BackEnd/Config/*`, controllers, and mail utilities:
```
PORT=4000

# Database
MONGODB_URL=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret_key

# Razorpay
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_cloudinary_folder_name

# Email (Nodemailer)
MAIL_HOST=your_smtp_host
MAIL_USER=your_smtp_username
MAIL_PASS=your_smtp_password
```
Notes:
- Database URL is read from `MONGODB_URL` (see `BackEnd/Config/database.js`).
- Cloudinary keys are `CLOUD_NAME`, `API_KEY`, `API_SECRET` (see `BackEnd/Config/cloudinary.js`).
- Razorpay keys are `RAZORPAY_KEY` and `RAZORPAY_SECRET`.

### Frontend (`FrontEnd/.env`)
Used by `FrontEnd/src/Services/apis.js` and payment flow:
```
VITE_BASE_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

## Installation
Clone and install dependencies:
```
git clone https://github.com/subirxd/skillify.git
cd Skillify
npm install
```
Install app dependencies in sub-packages (first run will auto install if missing, but you can do it explicitly):
```
cd BackEnd && npm install
cd ../FrontEnd && npm install
cd ..
```

## Running Locally
Option A: Run both concurrently from the repo root:
```
npm run dev
```
- Backend: reads `PORT` from env (default example: 4000)
- Frontend: Vite default port is 5173

Option B: Run separately:
```
# Terminal 1
cd BackEnd && npm run dev

# Terminal 2
cd FrontEnd && npm run dev
```

App URLs:
- Frontend (Vite default): `http://localhost:5173`
- Backend: `http://localhost:4000`
- API Base (as used by frontend): `http://localhost:4000/api/v1`

CORS note: Backend currently allows origins set in `BackEnd/index.js`. If you run Vite on port 5173 and face CORS issues, either:
- start Vite on port 3000: `npm run dev -- --port 3000` in `FrontEnd`, or
- add `http://localhost:5173` to the allowed origins in `BackEnd/index.js`.

## API Routes (base: `/api/v1`)
Mounted in `BackEnd/index.js`:
- `POST /auth/*` (signup, login, OTP, reset/change password)
- `GET/POST /profile/*` (user details, update profile, display picture, enrolled courses, instructor dashboard)
- `GET/POST /course/*` (CRUD courses, sections, subsections, search, categories, ratings, progress)
- `POST /payment/*` (capture/verify payment, success email)
- `POST /contactus/contact` (contact form)

For request/response details, see controllers under `BackEnd/Controllers/*` and the Postman collection `BackEnd/CoursePlatform.postman_collection.json`.

## Project Structure
```
Skillify/
  BackEnd/        # Express API, DB, payments, uploads
    Config/       # cloudinary, database, razorpay setup
    Controllers/  # route handlers (auth, course, payment, profile, etc.)
    Middleware/   # auth middleware
    Models/       # Mongoose schemas
    Routes/       # route definitions
    Utils/        # helpers (mailSender, imageUploader, etc.)
  FrontEnd/       # React app (Vite, Tailwind)
    src/
      components/ # UI components
      pages/      # route pages
      Services/   # API wrappers and endpoints
```

## Screenshots
![Home](https://res.cloudinary.com/dpfmucera/image/upload/v1757249446/home_vripl7.png)
![Login](https://res.cloudinary.com/dpfmucera/image/upload/v1757249446/login_zmasc4.png)
![Signup](https://res.cloudinary.com/dpfmucera/image/upload/v1757249446/signup_ugu53r.png)
![Course Page](https://res.cloudinary.com/dpfmucera/image/upload/v1757249445/course_page_i6gbfl.png)
![Add Review](https://res.cloudinary.com/dpfmucera/image/upload/v1757249444/add_review_ix7iu3.png)
![Student Enrolled Courses](https://res.cloudinary.com/dpfmucera/image/upload/v1757249446/student_enrolled_courses_kbn0fs.png)
![My Profile](https://res.cloudinary.com/dpfmucera/image/upload/v1757249445/myprofile_nieo8v.png)
![Instructor Dashboard](https://res.cloudinary.com/dpfmucera/image/upload/v1757249445/instructor_dashboard_ufg4dc.png)
![Add Course](https://res.cloudinary.com/dpfmucera/image/upload/v1757249444/add_course_rprebo.png)
![Contact Us](https://res.cloudinary.com/dpfmucera/image/upload/v1757249444/contactUS_g4znhp.png)

## Deployment
- Frontend can be deployed on Vercel/Netlify. Set envs `VITE_BASE_URL` and `VITE_RAZORPAY_KEY`.
- Backend can be deployed on a Node host. Set all backend `.env` vars above and ensure CORS origins include your deployed frontend URL.
