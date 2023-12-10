import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";

/*
Gets all science groups where user is participant.
*/
export const tryGetUserScienceGroups = createAsyncThunk(
  'getUserScienceGroups',
  async (userData, thunkAPI) => {
    const params = new URLSearchParams();
    const response = await axios.post(API_URL + "science_groups/get_all_for_user", params);
    const data = JSON.parse(response.data);
    return {
      message: data.message,
      science_groups: data.science_groups, // Make class and convert data to it???
    };
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
    const response = await axios.post(API_URL + "science_groups/enter", params);
    const data = JSON.parse(response.data);
    return {
      message: data.message,
      science_group_data: data.science_group_data
    };
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
    const response = await axios.post(API_URL + "science_groups/leave", params);
    return {
      message: JSON.parse(response.data).message
    };
  }
);


export const trySendMembershipRequestScienceGroup = createAsyncThunk(
  'sendMembershipRequestScienceGroup',
  async (enterData, thunkAPI) => {
    const params = new URLSearchParams();
    const response = await axios.post(API_URL + "science_groups/send_membership_request", params);
    return {
      message: JSON.parse(response.data).message
    };
  }
);

export const scienceGroupDataSlice = createSlice({
  name: "scienceGroupData",
  initialState: {
    /*
    ### about "current_science_group_id"
    It defines current group for user.
    in hub == null
    in some science group != null
    */
    current_science_group_id: null,
    /*
    ### about "is_group_owner"
    Used for showing user, are they owner of the current group or not.
    */
    is_group_owner: false,

  },
  reducers: {},
  extraReducers:{
    [tryGetUserScienceGroups.pending]: (state) => {
      // When loading do something
    },
    [tryGetUserScienceGroups.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = payload.login;
        state.entrance_error_message = null;
      } else {
        state.entrance_error_message = payload.message;
        console.log(payload.message);
      }
    },
    [tryGetUserScienceGroups.rejected]: (state) => {
      console.log("Problem with tryGetUserScienceGroups");
    },


    [tryEnterScienceGroup.pending]: (state) => {
      // When loading do something
    },
    [tryEnterScienceGroup.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = payload.login;
        state.entrance_error_message = null;
      } else {
        state.entrance_error_message = payload.message;
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
        state.login = null;
      } else {
        console.log(payload.message);
      }
    },
    [tryLeaveScienceGroup.rejected]: (state) => {
      console.log("Problem with tryLeaveScienceGroup");
    },




    [trySendMembershipRequestScienceGroup.pending]: (state) => {
      // When loading do something
    },
    [trySendMembershipRequestScienceGroup.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        state.login = null;
      } else {
        console.log(payload.message);
      }
    },
    [trySendMembershipRequestScienceGroup.rejected]: (state) => {
      console.log("Problem with trySendMembershipRequestScienceGroup");
    },
  }
});

export default scienceGroupDataSlice.reducer;