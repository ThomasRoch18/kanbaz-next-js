import { createSlice } from "@reduxjs/toolkit";
import * as client from "../../client";
const quizzes = await client.fetchAllQuizzes();
const initialState = {
  quizzes: quizzes,
  quiz: null,
};
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
     setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    setQuiz: (state, action) => {
        state.quiz = action.payload;
    }
}
});
export const { setQuizzes, setQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;