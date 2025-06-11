import "dotenv/config";
import express from 'express'
import session from "express-session";
import Hello from "./Hello.js"
import Lab5 from "./Lab5.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

// Configure CORS to support cookies and allow both Netlify and Render deployments
const allowedOrigins = [
  process.env.NETLIFY_URL,
  process.env.RENDER_FRONTEND_URL || "https://kambaz-react-web-app-cs5610-sm25.onrender.com",
  "https://*.netlify.app",  // Allow all Netlify preview URLs
  "http://localhost:5173", // Vite dev server
  "http://localhost:4000", // Preview server
  "http://localhost:3000"  // Alternative dev server
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

// Configure sessions
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

Lab5(app)
Hello(app)
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});