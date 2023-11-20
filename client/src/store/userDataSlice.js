import {createSlice} from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    login: null
  },
  reducers: {
    enter: (state, action) =>{
      console.log("Entering...");
      const params = new URLSearchParams();
      params.append('login', action.payload.login);
      params.append('password', action.payload.password);
      axios.post(API_URL + "enter", params)
        .then((response) => {
          console.log(response.data);
          let data = JSON.parse(response.data);
          if (data.message === ""){
            state.login = data.login;
          }
        });
    },
    register: (state, action)=>{
      console.log("Registering...");
      axios.post(API_URL + "register", null, {params:{
        "login":1 ,
        "password": 1,
      }})
        .then((response) => {
          let data = JSON.parse(response.data);
          if (data.message === ""){
            state.login = data.login;
          }
        });
    },
    leave: (state) =>{
      state.login = null;
    }
  }
});

export const { enter, register, leave } = userDataSlice.actions;
export default userDataSlice.reducer;