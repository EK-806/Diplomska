import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosApiCall from "@/lib/axiosApiCall";
import { jwtDecode } from "jwt-decode";

function isJwt(token) {
  return typeof token === "string" && token.split(".").length === 3;
}

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!isJwt(accessToken)) {
        throw new Error("No valid accessToken found. Please login again.");
      }

      const decoded = jwtDecode(accessToken);
      const userId = decoded?._id;

      if (!userId) throw new Error("Token missing user _id.");

      const res = await axiosApiCall.get(`/api/v1/user/userdata/${userId}`);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("updateToken");
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    ClearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || "Failed to fetch user data";
      });
  },
});

export const { Logout, ClearAuthError } = userSlice.actions;

export default userSlice.reducer;