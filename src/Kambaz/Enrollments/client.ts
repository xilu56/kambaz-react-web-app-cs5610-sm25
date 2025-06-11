import axiosWithCredentials, { REMOTE_SERVER } from "../../api/axios";

export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
export const USERS_API = `${REMOTE_SERVER}/api/users`;
export const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findAllEnrollments = async () => {
  const response = await axiosWithCredentials.get(ENROLLMENTS_API);
  return response.data;
};

export const findEnrollmentById = async (enrollmentId: string) => {
  const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}/${enrollmentId}`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/enrollments`);
  return response.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/enrollments`);
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