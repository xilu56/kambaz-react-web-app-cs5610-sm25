import db from "../Database/index.js";

export const findAllAssignments = () => db.assignments;

export const findAssignmentById = (assignmentId) => db.assignments.find((assignment) => assignment._id === assignmentId);

export const findAssignmentsForCourse = (courseId) => db.assignments.filter((assignment) => assignment.course === courseId);

export const createAssignment = (assignment) => {
  const newAssignment = { ...assignment, _id: new Date().getTime().toString() };
  db.assignments = [...db.assignments, newAssignment];
  return newAssignment;
};

export const updateAssignment = (assignmentId, assignment) => {
  db.assignments = db.assignments.map((a) => (a._id === assignmentId ? { ...assignment, _id: assignmentId } : a));
  return { ...assignment, _id: assignmentId };
};

export const deleteAssignment = (assignmentId) => {
  db.assignments = db.assignments.filter((assignment) => assignment._id !== assignmentId);
}; 