import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../config";

const initialState = {
  loading: false,
  success: null,
  error: null,
  tasks: [],
  totalPages: 0,
};

export const getAllTasks = createAsyncThunk(
  "task/getAllTasks",
  async ({ page, filter }) => {
    try {
      const response = await axios.get(`${BASE_URL}/get/tasks?page=${page}&search=${filter}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
);

export const updateTasksOrder = createAsyncThunk(
  "task/updateTasksOrder",
  async (data) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/tasks/order`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
);

export const deleteTask = createAsyncThunk("task/deleteTask", async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/task/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
});

export const createTask = createAsyncThunk("task/createTask", async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/add/task`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
});

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, data }) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/task/${id}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
);
export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = "Data fetched successfully";
        state.tasks = action.payload.tasks;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateTasksOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTasksOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload.message;
      })
      .addCase(updateTasksOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload.message;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload.message;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload.message;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const {} = taskSlice.actions;

export default taskSlice.reducer;
