import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";

export const tryEnter = createAsyncThunk(
  'enter',
  async (enterData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('login', enterData.login);
    params.append('password', enterData.password);
    const response = await axios.post(API_URL + "enter", params);
    return {
      message: JSON.parse(response.data).message,
      login: enterData.login
    };
  }
);

export const tryRegister = createAsyncThunk(
  'register',
  async (enterData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('login', enterData.login);
    params.append('password', enterData.password);
    const response = await axios.post(API_URL + "register", params);
    return {
      message: JSON.parse(response.data).message,
      login: enterData.login
    };
  }
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    login: null
  },
  reducers: {},
  extraReducers:{
    [tryRegister.pending]: (state) => {
      // When loading do something
    },
    [tryRegister.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = payload.login;
      }
    },
    [tryRegister.rejected]: (state) => {
      console.log("Problem with registering");
    }
  }
});

export default userDataSlice.reducer;