import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { data } from 'react-router-dom';

const initialState = {
  loading: false,
  success: null,
  error: null,
  token: "",
}

// login
export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    // console.log(data)
    try {
      const response = await axios.post(`${BASE_URL}/login`, data);
      // if (!response.ok) throw new Error("Failed to fetch data");
      return await response.data;
    } catch (error) {
      console.log(error)
      return (error.message);
    }
  }
);

// registration
export const registration = createAsyncThunk(
  "auth/registration",
  async (data) => {
    console.log(data)
    try {
      const response = axios.post(`${BASE_URL}/signup`, data);
      return await response.data;
    } catch (error) {
      console.log(error);
      return (error.message);
    }
  }
);

// Forgot Password Thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, data);
      return response.data; // No need for extra await
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reset Password Thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
        state.success = "Logged in successfully"
        state.token = action.payload;
        // set token
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.user.username)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      // Registration cases
      .addCase(registration.pending, (state) => {
        state.loading = true;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = "Registered successfully";
      })
      .addCase(registration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password Cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = "Password reset otp sent successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      // Reset Password Cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error; 
      })

  }
})

export const { clearMessage } = authSlice.actions

export default authSlice.reducer