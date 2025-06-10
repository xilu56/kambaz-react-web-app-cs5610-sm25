import * as dao from "./dao.js";

export default function CourseRoutes(app) {
  
  // Get all courses
  app.get("/api/courses", (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  });

  // Get a specific course by ID
  app.get("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const course = dao.findCourseById(courseId);
    res.send(course);
  });

  // Create a new course
  app.post("/api/courses", (req, res) => {
    const course = dao.createCourse(req.body);
    res.send(course);
  });

  // Update a course
  app.put("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const course = dao.updateCourse(courseId, req.body);
    res.send(course);
  });

  // Delete a course
  app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(204);
  });
} 