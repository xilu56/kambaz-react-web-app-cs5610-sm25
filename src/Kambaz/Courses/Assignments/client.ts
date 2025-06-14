import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "https://kambaz-node-server-app-cs5610-sm25.onrender.com";
export const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
export const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const fetchAssignment = async (assignmentId: string) => {
  const response = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const createAssignment = async (assignment: any) => {
  const response = await axios.post(ASSIGNMENTS_API, assignment);
  return response.data;
};

export const updateAssignment = async (assignmentId: string, assignment: any) => {
  const response = await axios.put(`${ASSIGNMENTS_API}/${assignmentId}`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
}; 