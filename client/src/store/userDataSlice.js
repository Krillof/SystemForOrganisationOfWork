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

export const tryLeave = createAsyncThunk(
  'leave',
  async (enterData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('login', enterData.login);
    const response = await axios.post(API_URL + "leave", params);
    return {
      message: JSON.parse(response.data).message,
      login: enterData.login
    };
  }
);

export const tryDelete = createAsyncThunk(
  'delete',
  async (enterData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('login', enterData.login);
    const response = await axios.post(API_URL + "delete", params);
    return {
      message: JSON.parse(response.data).message,
      login: enterData.login
    };
  }
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    login: null,
    entrance_error_message: null
  },
  reducers: {},
  extraReducers:{
    [tryRegister.pending]: (state) => {
      // When loading do something
    },
    [tryRegister.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = payload.login;
        state.entrance_error_message = null;
      } else {
        state.entrance_error_message = payload.message;
        console.log(payload.message);
      }
    },
    [tryRegister.rejected]: (state) => {
      console.log("Problem with registering");
    },


    [tryEnter.pending]: (state) => {
      // When loading do something
    },
    [tryEnter.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = payload.login;
        state.entrance_error_message = null;
      } else {
        state.entrance_error_message = payload.message;
        console.log(payload.message);
      }
    },
    [tryEnter.rejected]: (state) => {
      console.log("Problem with entering");
    },




    [tryLeave.pending]: (state) => {
      // When loading do something
    },
    [tryLeave.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = null;
      } else {
        console.log(payload.message);
      }
    },
    [tryLeave.rejected]: (state) => {
      console.log("Problem with leaving");
    },




    [tryDelete.pending]: (state) => {
      // When loading do something
    },
    [tryDelete.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = null;
      } else {
        console.log(payload.message);
      }
    },
    [tryDelete.rejected]: (state) => {
      console.log("Problem with deleting");
    },
  }
});

export default userDataSlice.reducer;