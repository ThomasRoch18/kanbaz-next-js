import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { enrollments } from "../Database";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentState = {
  enrollments: enrollments,
};

export const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const { userId, courseId } = action.payload;
      if (!state.enrollments.find(e => e.user === userId && e.course === courseId)) {
        state.enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
      }
    },
    unenrollFromCourse: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      state.enrollments = state.enrollments.filter(e => !(e.user === action.payload.userId && e.course === action.payload.courseId));
    },
    setEnrollments: (state, { payload: enrollments }) => {
     state.enrollments = enrollments;
   },
  },
});

export const { enrollInCourse, unenrollFromCourse, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;