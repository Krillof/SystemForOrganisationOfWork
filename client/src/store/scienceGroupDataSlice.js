import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";
import { read_cookie } from 'sfcookies';
import { token_key } from "./userDataSlice";

export const tryGetAvailableGroups = createAsyncThunk(
  'getAvailableGroups',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/get_available_groups", params);
    return JSON.parse(response.data);
  }
);

export const trySendMembershipRequestScienceGroup = createAsyncThunk(
  'sendMembershipRequestScienceGroup',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('science_group_id', outerData.science_group_id);
    const response = await axios.post(API_URL + "science_groups/send_membership_request", params);
    return JSON.parse(response.data);
  }
);

export const tryGetMembershipRequests = createAsyncThunk(
  'getMembershipRequests',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/get_membership_requests", params);
    return JSON.parse(response.data);
  }
);

export const tryAcceptMembershipRequest = createAsyncThunk(
  'acceptMembershipRequest',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('user_id', outerData.user_id);
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
  async (outerData, thunkAPI) => {
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
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('science_group_id', outerData.science_group_id);
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/enter", params);
    const data = JSON.parse(response.data);
    return JSON.parse(response.data);
  }
);


export const tryGetCheckIfEntered = createAsyncThunk(
  'getCheckIfEntered',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/check_if_entered", params);
    return JSON.parse(response.data);
  }
);

/*
Used to leave group (For example, to go to another group."Leave" means here "to go to hub"), 
  where user is participant.
*/
export const tryLeaveScienceGroup = createAsyncThunk(
  'leaveScienceGroup',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/leave", params);
    return JSON.parse(response.data);
  }
);




export const tryUpdateScienceGroupMindMapData = createAsyncThunk(
  'updateScienceGroupMindMapData',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    const response = await axios.post(API_URL + "science_groups/workspace/update_mindmap", params);
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
    current_group_title:null,

    workspace_mindmap_data: null,
    is_have_to_update_mindmap_data: true,
  },
  reducers: {},
  extraReducers:{
    [tryGetAvailableGroups.pending]: (state) => {
      // When loading do something
    },
    [tryGetAvailableGroups.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == ""){
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


    [tryGetCheckIfEntered.pending]: (state) => {
      // When loading do something
    },
    [tryGetCheckIfEntered.fulfilled]: (state, { payload }) => {
      if (payload.message == ""){
        if (payload.data != ""){
          state.current_group_title = payload.data;
        }
      } else {
        console.log(payload.message);
      }
    },
    [tryGetCheckIfEntered.rejected]: (state) => {
      console.log("Problem with tryEnterScienceGroup");
    },


    [tryLeaveScienceGroup.pending]: (state) => {
      // When loading do something
    },
    [tryLeaveScienceGroup.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == ""){
        state.current_group_title = null;
      } else {
        console.log(payload.message);
      }
    },
    [tryLeaveScienceGroup.rejected]: (state) => {
      console.log("Problem with tryLeaveScienceGroup");
    },




    [tryUpdateScienceGroupMindMapData.pending]: (state) => {
      // When loading do something
    },
    [tryUpdateScienceGroupMindMapData.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == ""){
        state.workspace_mindmap_data = payload.data;
        state.is_have_to_update_mindmap_data = false;
      } else {
        console.log(payload.message);
      }

    },
    [tryUpdateScienceGroupMindMapData.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },
   
  }
});

export default scienceGroupDataSlice.reducer;