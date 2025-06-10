import db from "../Database/index.js";

let { enrollments } = db;

export const findAllEnrollments = () => enrollments;

export const findEnrollmentById = (enrollmentId) => enrollments.find((enrollment) => enrollment._id === enrollmentId);

export const findEnrollmentsForUser = (userId) => enrollments.filter((enrollment) => enrollment.user === userId);

export const findEnrollmentsForCourse = (courseId) => enrollments.filter((enrollment) => enrollment.course === courseId);

export const enrollUserInCourse = (userId, courseId) => {
  const newEnrollment = { _id: new Date().getTime().toString(), user: userId, course: courseId };
  enrollments = [...enrollments, newEnrollment];
  return newEnrollment;
};

export const unenrollUserFromCourse = (userId, courseId) => {
  enrollments = enrollments.filter((enrollment) => !(enrollment.user === userId && enrollment.course === courseId));
};

export const deleteEnrollment = (enrollmentId) => {
  enrollments = enrollments.filter((enrollment) => enrollment._id !== enrollmentId);
}; 