import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/Reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentReducer from "./Courses/[cid]/Assignments/reducer"
import enrollmentsReducer from "./Dashboard/reducer"
const store = configureStore({
 reducer: { coursesReducer, modulesReducer, accountReducer, assignmentReducer, enrollmentsReducer},
});
export type RootState = ReturnType<typeof store.getState>;
export default store;