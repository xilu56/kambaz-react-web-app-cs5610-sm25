import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  const findAllAssignments = (req, res) => {
    const assignments = dao.findAllAssignments();
    res.json(assignments);
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.findAssignmentById(assignmentId);
    res.json(assignment);
  };

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignment = (req, res) => {
    const assignment = dao.createAssignment(req.body);
    res.json(assignment);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.updateAssignment(assignmentId, req.body);
    res.json(status);
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    dao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  app.get("/api/assignments", findAllAssignments);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/assignments", createAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
} 