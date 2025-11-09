import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";
const initialState = {
  assignments: assignments,
};
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload: assignment }) => {
      const newAssignment: any = {
        _id: uuidv4(),
        title: assignment.title,
        description: assignment.description,
        points: assignment.points,
        due: assignment.due,
        availableFrom: assignment.availableFrom,
        availableUntil: assignment.availableUntil,
        course: assignment.course,
      };
      state.assignments = [...state.assignments, newAssignment] as any;
    },
    updateAssignment: (state, { payload }) => {
      const index = state.assignments.findIndex(a => a._id === payload._id);
      if (index !== -1) {
        state.assignments[index] = { ...state.assignments[index], ...payload };
      }
    },
    deleteAssignment: (state, action) => {
        state.assignments = state.assignments.filter(
        (a: any) => a._id !== action.payload
    );
    },
  }
});
export const { addAssignment, updateAssignment, deleteAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;