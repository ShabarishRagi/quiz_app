# MERN Stack Quiz Web Application

A dynamic quiz platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to take quizzes and administrators to manage quiz content.

## Features

- User Registration & Login
- Role-based access (User vs Admin)
- Admin panel for quiz management
- Real-time result and score tracking
- Mobile responsive UI
- RESTful API architecture

## Project Structure

```
client/                 # React frontend
  ├── src/
  │   ├── components/  # Reusable components
  │   ├── pages/      # Page components
  │   └── App.js      # Main App component
server/                # Node.js backend
  ├── routes/         # API routes
  ├── models/         # MongoDB models
  ├── controllers/    # Route controllers
  └── server.js       # Server entry point
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a .env file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm start
   ```

## Technologies Used

- Frontend: React.js, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Styling: CSS/SCSS 