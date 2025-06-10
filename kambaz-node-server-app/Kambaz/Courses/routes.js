import * as dao from "./dao.js";

export default function CourseRoutes(app) {
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.json(courses);
  };

  const findCourseById = (req, res) => {
    const { courseId } = req.params;
    const course = dao.findCourseById(courseId);
    res.json(course);
  };

  const createCourse = (req, res) => {
    const course = dao.createCourse(req.body);
    res.json(course);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.updateCourse(courseId, req.body);
    res.json(status);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(204);
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.post("/api/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
} 