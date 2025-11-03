import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../app/Labs/Lab4/ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "../app/Labs/Lab4/ReduxExamples/CounterRedux/counterReducer";
import addReducer from "../app/Labs/Lab4/ReduxExamples/AddRedux/addReducer";
import todosReducer from "../app/Labs/Lab4/ReduxExamples/todos/todosReducer";
const store = configureStore({
  reducer: {
    helloReducer,
    counterReducer,
    addReducer,
    todosReducer
  },
});
export default store;