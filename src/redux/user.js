import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadUserThunk = createAsyncThunk("user/loadUser", async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  const data = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/api/auth/user`,
    config
  );
  return JSON.stringify(data);
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("token"),
    isAuth: false,
    isLoading: false,
    isAdmin: false,
    user: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.isAuth = false;
      state.isLoading = false;
      state.isAdmin = false;
    },
  },
  extraReducers: {
    [loadUserThunk.fulfilled](state, { payload }) {
      state.user = JSON.parse(payload);
      state.isAdmin = JSON.parse(payload).data.isAdmin;
      state.isLoading = false;
    },
    [loadUserThunk.pending](state) {
      state.isLoading = true;
    },
    [loadUserThunk.rejected](state) {
      localStorage.removeItem("token");
    },
    // [loginThunk.fulfilled](state, { payload }) {
    //   localStorage.setItem("token", payload.token);
    //   state.user = payload.user;
    //   state.isAuth = true;
    //   state.isLoading = false;
    // },
    // [loginThunk.rejected](state) {
    //   localStorage.removeItem("token");
    //   state.token = null;
    //   state.user = null;
    //   state.isAuth = false;
    //   state.isLoading = false;
    // },
    // [registerThunk.fulfilled](state, { payload }) {
    //   state.isAuth = true;
    //   state.isLoading = false;
    // },
    // [registerThunk.rejected](state) {
    //   localStorage.removeItem("token");
    //   state.token = null;
    //   state.user = null;
    //   state.isAuth = false;
    //   state.isLoading = false;
    // },
  },
});

export const { loadUser, login, register, logout } = userSlice.actions;
export default userSlice.reducer;
