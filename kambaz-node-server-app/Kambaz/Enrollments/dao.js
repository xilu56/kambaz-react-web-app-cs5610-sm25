import db from "../Database/index.js";

export const findAllEnrollments = () => db.enrollments;

export const findEnrollmentById = (enrollmentId) => db.enrollments.find((enrollment) => enrollment._id === enrollmentId);

export const findEnrollmentsForUser = (userId) => db.enrollments.filter((enrollment) => enrollment.user === userId);

export const findEnrollmentsForCourse = (courseId) => db.enrollments.filter((enrollment) => enrollment.course === courseId);

export const enrollUserInCourse = (userId, courseId) => {
  // Check if enrollment already exists to prevent duplicates
  const existingEnrollment = db.enrollments.find((enrollment) => 
    enrollment.user === userId && enrollment.course === courseId
  );
  
  if (existingEnrollment) {
    return existingEnrollment;
  }
  
  const newEnrollment = { _id: new Date().getTime().toString(), user: userId, course: courseId };
  db.enrollments = [...db.enrollments, newEnrollment];
  return newEnrollment;
};

export const unenrollUserFromCourse = (userId, courseId) => {
  db.enrollments = db.enrollments.filter((enrollment) => !(enrollment.user === userId && enrollment.course === courseId));
};

export const deleteEnrollment = (enrollmentId) => {
  db.enrollments = db.enrollments.filter((enrollment) => enrollment._id !== enrollmentId);
}; 