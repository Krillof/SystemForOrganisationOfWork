import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";
import { read_cookie } from 'sfcookies';
import { token_key } from "./userDataSlice";

export const tryGetAvailableGroups = createAsyncThunk(
  'getAvailableGroups',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/get_available_groups", params);
    return JSON.parse(response.data);
  }
);

export const trySendMembershipRequestScienceGroup = createAsyncThunk(
  'sendMembershipRequestScienceGroup',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('science_group_id', data.science_group_id);
    const response = await axios.post(API_URL + "science_groups/send_membership_request", params);
    return JSON.parse(response.data);
  }
);

export const tryGetMembershipRequests = createAsyncThunk(
  'getMembershipRequests',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/get_membership_requests", params);
    return JSON.parse(response.data);
  }
);

export const tryAcceptMembershipRequest = createAsyncThunk(
  'acceptMembershipRequest',
  async (data, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('user_id', data.user_id);
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/accept_membership_request", params);
    return JSON.parse(response.data);
  }
);


/*
Gets all science groups where user is participant.
*/
export const tryGetParticipatedGroups = createAsyncThunk(
  'getParticipatedGroups',
  async (userData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/get_participated_groups", params);
    return JSON.parse(response.data);
  }
);

/*
Used to enter group, where user is already participant.
(Loads science group data.)
*/
export const tryEnterScienceGroup = createAsyncThunk(
  'enterScienceGroup',
  async (userData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('science_group_id', data.science_group_id);
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/enter", params);
    const data = JSON.parse(response.data);
    return JSON.parse(response.data);
  }
);


export const tryGetScienceGroupData = createAsyncThunk(
  'getScienceGroupData',
  async (userData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/get_data", params);
    return JSON.parse(response.data);
  }
);

/*
Used to leave group (For example, to go to another group."Leave" means here "to go to hub"), 
  where user is participant.
*/
export const tryLeaveScienceGroup = createAsyncThunk(
  'leaveScienceGroup',
  async (userData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/leave", params);
    return JSON.parse(response.data);
  }
);






export const scienceGroupDataSlice = createSlice({
  name: "scienceGroupData",
  initialState: {
    available_groups:[],
    is_updated_available_groups: false,
    participated_groups:[],
    is_updated_participated_groups: false,
    gotten_requests_for_membership:[],
    current_group_id:null,
    current_group_title:null,
  },
  reducers: {},
  extraReducers:{
    [tryGetAvailableGroups.pending]: (state) => {
      // When loading do something
    },
    [tryGetAvailableGroups.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        console.log(payload.data);
        state.available_groups = payload.data;
      } else {
        console.log(payload.message);
      }
      state.is_updated_available_groups = true;
    },
    [tryGetAvailableGroups.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },



    [trySendMembershipRequestScienceGroup.pending]: (state) => {
      // When loading do something
    },
    [trySendMembershipRequestScienceGroup.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        // nothing
      } else {
        console.log(payload.message);
      }
    },
    [trySendMembershipRequestScienceGroup.rejected]: (state) => {
      console.log("Problem with trySendMembershipRequestScienceGroup");
    },




    [tryGetMembershipRequests.pending]: (state) => {
      // When loading do something
    },
    [tryGetMembershipRequests.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.gotten_requests_for_membership = state.data;
      } else {
        console.log(payload.message);
      }
    },
    [tryGetMembershipRequests.rejected]: (state) => {
      console.log("Problem with tryGetMembershipRequests");
    },


    [tryAcceptMembershipRequest.pending]: (state) => {
      // When loading do something
    },
    [tryAcceptMembershipRequest.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        // nothing
      } else {
        console.log(payload.message);
      }
    },
    [tryAcceptMembershipRequest.rejected]: (state) => {
      console.log("Problem with tryAcceptMembershipRequest");
    },



    [tryGetParticipatedGroups.pending]: (state) => {
      // When loading do something
    },
    [tryGetParticipatedGroups.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.participated_groups = payload.data;
      } else {
        console.log(payload.message);
      }
      state.is_updated_participated_groups = true;
    },
    [tryGetParticipatedGroups.rejected]: (state) => {
      console.log("Problem with tryGetParticipatedGroups");
    },



    [tryEnterScienceGroup.pending]: (state) => {
      // When loading do something
    },
    [tryEnterScienceGroup.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.current_group_title = payload.data;
      } else {
        console.log(payload.message);
      }
    },
    [tryEnterScienceGroup.rejected]: (state) => {
      console.log("Problem with tryEnterScienceGroup");
    },


    [tryLeaveScienceGroup.pending]: (state) => {
      // When loading do something
    },
    [tryLeaveScienceGroup.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.current_group_title = null;
      } else {
        console.log(payload.message);
      }
    },
    [tryLeaveScienceGroup.rejected]: (state) => {
      console.log("Problem with tryLeaveScienceGroup");
    },


   
  }
});

export default scienceGroupDataSlice.reducer;