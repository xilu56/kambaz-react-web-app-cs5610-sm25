import axios from "axios";
// Temporarily use localhost for development
export const REMOTE_SERVER = "http://localhost:4000";
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
const USERS_API = `${REMOTE_SERVER}/api/users`;

export const findAllEnrollments = async () => {
  const response = await axios.get(ENROLLMENTS_API);
  return response.data;
};

export const findEnrollmentById = async (enrollmentId: string) => {
  const response = await axios.get(`${ENROLLMENTS_API}/${enrollmentId}`);
  return response.data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const response = await axios.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  const response = await axios.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/${userId}/enrollments`);
  return response.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${ENROLLMENTS_API}/course/${courseId}`);
  return response.data;
}; 