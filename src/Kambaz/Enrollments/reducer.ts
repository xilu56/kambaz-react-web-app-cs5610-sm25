import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
    enrollUserInCourse: (state, { payload: enrollment }) => {
      // Check if enrollment already exists to prevent duplicates
      const existingEnrollment = state.enrollments.find((e: any) => 
        e.user === enrollment.user && e.course === enrollment.course
      );
      
      if (!existingEnrollment) {
        state.enrollments = [...state.enrollments, enrollment] as any;
      }
    },
    unenrollUserFromCourse: (state, { payload: { userId, courseId } }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === userId && e.course === courseId)
      );
    },
    deleteEnrollment: (state, { payload: enrollmentId }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => e._id !== enrollmentId
      );
    },
  },
});

export const { setEnrollments, enrollUserInCourse, unenrollUserFromCourse, deleteEnrollment } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer; 