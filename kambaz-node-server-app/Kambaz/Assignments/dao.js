import db from "../Database/index.js";

let { assignments } = db;

export const findAllAssignments = () => assignments;

export const findAssignmentById = (assignmentId) => assignments.find((assignment) => assignment._id === assignmentId);

export const findAssignmentsForCourse = (courseId) => assignments.filter((assignment) => assignment.course === courseId);

export const createAssignment = (assignment) => {
  const newAssignment = { ...assignment, _id: new Date().getTime().toString() };
  assignments = [...assignments, newAssignment];
  return newAssignment;
};

export const updateAssignment = (assignmentId, assignment) => {
  assignments = assignments.map((a) => (a._id === assignmentId ? { ...assignment, _id: assignmentId } : a));
  return assignment;
};

export const deleteAssignment = (assignmentId) => {
  assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}; 