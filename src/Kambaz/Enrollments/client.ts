import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
const USERS_API = `${REMOTE_SERVER}/api/users`;

export const findAllEnrollments = async () => {
  const response = await axiosWithCredentials.get(ENROLLMENTS_API);
  return response.data;
};

export const findEnrollmentById = async (enrollmentId: string) => {
  const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}/${enrollmentId}`);
  return response.data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const url = `${ENROLLMENTS_API}/user/${userId}`;
  const response = await axiosWithCredentials.get(url);
  return response.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}/course/${courseId}`);
  return response.data;
}; 