import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { taskSlice } from "./task/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    task: taskSlice.reducer,
  },
});
