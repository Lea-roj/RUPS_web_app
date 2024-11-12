# TakeTaxi

This project is a full-stack web application built with an Express backend and a React frontend. It uses MongoDB as the database. Follow these instructions to set up the project:

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local database)
- [Git](https://git-scm.com/)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lea-roj/RUPS_web_app
   cd RUPS_web_app
   ```

2. **Install Backend Dependencies**

   Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**

   Navigate to the frontend directory and install dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set Up Environment Variables**

   In the `backend` directory, create a `.env` file with the following contents:

   ```plaintext
   MONGO_URI=mongodb://localhost:27017/RUPS
   PORT=8000
   ```

5. **Build the Frontend**

   Once in the `frontend` directory, build the React app for production:

   ```bash
   npm start
   ```

   This will create a production-ready `build` folder inside the `frontend` directory.

6. **Start the Application**

   Go to the `backend` directory and start the server:

   ```bash
   cd backend
   npm start
   ```

7. **Verify Setup**

   - Open a browser and go to [http://localhost:3000](http://localhost:3000). You should see the React app served by the Express server.

## Additional Information

### Database Setup

1. Ensure MongoDB is running locally. By default, MongoDB listens on `mongodb://localhost:27017`.
2. Open MongoDB Compass (or any other MongoDB client) and connect to `mongodb://localhost:27017`.
3. Create a new database named `RUPS` if it doesn't already exist.

![image](https://github.com/user-attachments/assets/2e567cbc-fe77-4d2e-bc38-7330cc2be56d)

### Troubleshooting

- Ensure MongoDB is running before starting the backend.
- Double-check your `.env` file configuration if you encounter database connection issues.

