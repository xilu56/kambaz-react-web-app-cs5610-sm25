import db from "../Database/index.js";

let { courses } = db;

export const findAllCourses = () => courses;

export const findCourseById = (courseId) => courses.find((course) => course._id === courseId);

export const createCourse = (course) => {
  const newCourse = { ...course, _id: new Date().getTime().toString() };
  courses = [...courses, newCourse];
  return newCourse;
};

export const updateCourse = (courseId, course) => {
  courses = courses.map((c) => (c._id === courseId ? { ...course, _id: courseId } : c));
  return course;
};

export const deleteCourse = (courseId) => {
  courses = courses.filter((course) => course._id !== courseId);
}; 