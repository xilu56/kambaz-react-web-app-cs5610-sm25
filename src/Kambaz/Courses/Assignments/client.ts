import axiosWithCredentials, { REMOTE_SERVER } from "../../../api/axios";

export const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
export const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findAllAssignments = async () => {
  const response = await axiosWithCredentials.get(ASSIGNMENTS_API);
  return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const response = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignment = async (assignment: any) => {
  const response = await axiosWithCredentials.post(ASSIGNMENTS_API, assignment);
  return response.data;
};

export const updateAssignment = async (assignmentId: string, assignment: any) => {
  const response = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignmentId}`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
}; 