import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "https://kambaz-node-server-app-cs5610-sm25.onrender.com";
export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/enrollments`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/${userId}/enrollments`);
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