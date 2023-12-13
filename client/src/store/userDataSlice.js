import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

export const token_key  = 'token';
export const login_key  = 'login';

export const tryEnter = createAsyncThunk(
  'enter',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('login', data.login);
    params.append('password', data.password);
    const response = await axios.post(API_URL + "users/enter", params);
    return {
      message: JSON.parse(response.data).message,
      token: JSON.parse(response.data).data,
      login: data.login
    };
  }
);

export const tryRegister = createAsyncThunk(
  'register',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('login', data.login);
    params.append('password', data.password);
    const response = await axios.post(API_URL + "users/register", params);
    return {
      message: JSON.parse(response.data).message,
      token: JSON.parse(response.data).data,
      login: data.login
    };
  }
);

export const tryLeave = createAsyncThunk(
  'leave',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "users/leave", params);
    return {
      message: JSON.parse(response.data).message,
      login: data.login
    };
  }
);

export const tryDelete = createAsyncThunk(
  'delete',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "users/delete", params);
    return {
      message: JSON.parse(response.data).message,
      login: data.login
    };
  }
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    login: null,
    entrance_error_message: null
  },
  reducers: {
    trySetCurrentLogin(state){
      if (read_cookie(token_key).length) {
        const token = read_cookie(token_key);
        const login = read_cookie(login_key);
        delete_cookie(token_key);
        delete_cookie(login_key);
        bake_cookie(token_key, token);
        bake_cookie(login_key, login);

        state.login = read_cookie(login_key);
      }
    },

  },
  extraReducers:{
    [tryRegister.pending]: (state) => {
      // When loading do something
    },
    [tryRegister.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = payload.login;
        state.entrance_error_message = null;
        bake_cookie(token_key, payload.token);
        bake_cookie(login_key, payload.login);
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
        bake_cookie(token_key, payload.token);
        bake_cookie(login_key, payload.login);
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
        delete_cookie(token_key);
        delete_cookie(login_key);
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
        delete_cookie(token_key);
        delete_cookie(login_key);
      } else {
        console.log(payload.message);
      }
    },
    [tryDelete.rejected]: (state) => {
      console.log("Problem with deleting");
    },
  }
});

export const { trySetCurrentLogin } = userDataSlice.actions;
export default userDataSlice.reducer;