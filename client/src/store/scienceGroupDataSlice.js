import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../index";
import axios from "axios";
import { read_cookie } from 'sfcookies';
import { token_key, updatedScienceGroupData } from "./userDataSlice";
import GlobalThemeModalContent from "../mindMap/ModalContentsForManagingMIndMapVerticies/GlobalThemeModalContent";
import TaskModalContent from "../mindMap/ModalContentsForManagingMIndMapVerticies/TaskModalContent";
import ArticleModalContent from "../mindMap/ModalContentsForManagingMIndMapVerticies/ArticleModalContent";

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
    params.append('membership_request_id', outerData.membership_request_id);
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





export const tryCreateGlobalThemeVertex = createAsyncThunk(
  'createGlobalThemeVertex',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('name', outerData.name);
    const response = await axios.post(API_URL + "science_groups/workspace/create_global_theme_vertex", params);
    return JSON.parse(response.data);
  }
);

export const tryCreateTaskVertex = createAsyncThunk(
  'createTaskVertex',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('name', outerData.name);
    params.append('parentId', outerData.parentId);
    const response = await axios.post(API_URL + "science_groups/workspace/create_task_vertex", params);
    return JSON.parse(response.data);
  }
);

export const tryCreateArticleVertex = createAsyncThunk(
  'createArticleVertex',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('doi', outerData.doi);
    params.append('name', outerData.name);
    params.append('parentId', outerData.parentId);
    const response = await axios.post(API_URL + "science_groups/workspace/create_article_vertex", params);
    return JSON.parse(response.data);
  }
);

export const tryDeleteVertex = createAsyncThunk(
  'deleteVertex',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('workspace_type', outerData.workspace_type);
    params.append('id', outerData.id);
    const response = await axios.post(API_URL + "science_groups/workspace/delete_vertex", params);
    return JSON.parse(response.data);
  }
);

export const tryGetArticleData = createAsyncThunk(
  'getArticleData',
  async (outerData, thunkAPI) => {
    const params = new URLSearchParams();
    params.append('token', read_cookie(token_key));
    params.append('id', outerData.id);
    const response = await axios.post(API_URL + "science_groups/workspace/get_article_data", params);
    var data = JSON.parse(response.data);
    data.id = outerData.id;
    return data;
  }
);

export const modalContentTypes = {
  GlobalTheme : "GlobalTheme",
  Task : "Task",
  Article : "Article"
};


export const scienceGroupDataSlice = createSlice({
  name: "scienceGroupData",
  initialState: {
    available_groups: [],
    is_updated_available_groups: false,
    participated_groups: [],
    is_updated_participated_groups: false,
    current_group_title: null,

    workspace_mindmap_data: null,
    is_have_to_update_mindmap_data: true,

    looking_at_gotten_requests_list: false,
    is_have_to_update_gotten_requests_for_membership: true,
    gotten_requests_for_membership: [],

    is_show_modal_for_creating_verticies: false,
    current_modal_for_verticies_type: "",
    current_modal_parent_id: 0,
    loaded_articles: {},
  },
  reducers: {
    startLookingAtGottenRequests(state) {
      state.looking_at_gotten_requests_list = true;
    },
    endLookingAtGottenRequests(state) {
      state.looking_at_gotten_requests_list = false;
    },
    updateScienceGroupData(state) {
      state.is_updated_available_groups = false;
      state.is_updated_participated_groups = false;
      state.is_have_to_update_mindmap_data = true;
      state.is_have_to_update_gotten_requests_for_membership = true;
    },
    closeModalForCreatingVerticies(state) {
      state.current_modal_for_verticies_type = "";
      state.is_show_modal_for_creating_verticies = false;
    },
    showModalForCreatingGlobalTheme(state) {
      state.current_modal_for_verticies_type = modalContentTypes.GlobalTheme;
      state.is_show_modal_for_creating_verticies = true;
    },
    showModalForCreatingTask(state, action) {
      state.current_modal_parent_id = action.payload.parentId;
      state.current_modal_for_verticies_type = modalContentTypes.Task;
      state.is_show_modal_for_creating_verticies = true;
    },
    showModalForCreatingArticle(state, action) {
      state.current_modal_parent_id = action.payload.parentId;
      state.current_modal_for_verticies_type = modalContentTypes.Article;
      state.is_show_modal_for_creating_verticies = true;
    },
  },
  extraReducers: {
    [tryGetAvailableGroups.pending]: (state) => {
      // When loading do something
    },
    [tryGetAvailableGroups.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == "") {
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
      if (payload.message == "") {
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
      if (payload.message == "") {
        state.is_have_to_update_gotten_requests_for_membership = false;
        state.gotten_requests_for_membership = payload.data;
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
      console.log(payload);
      if (payload.message == "") {
        state.is_have_to_update_gotten_requests_for_membership = true;
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
      if (payload.message == "") {
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
      if (payload.message == "") {
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
      if (payload.message == "") {
        if (payload.data != "") {
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
      if (payload.message == "") {
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
      if (payload.message == "") {
        state.workspace_mindmap_data = payload.data;
        state.is_have_to_update_mindmap_data = false;
      } else {
        console.log(payload.message);
      }

    },
    [tryUpdateScienceGroupMindMapData.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },




    

    [tryCreateGlobalThemeVertex.pending]: (state) => {
      // When loading do something
    },
    [tryCreateGlobalThemeVertex.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == "") {
        state.is_show_modal_for_creating_verticies = false;
        state.workspace_mindmap_data = null;
        state.is_have_to_update_mindmap_data = true;
      } else {
        console.log(payload.message);
      }

    },
    [tryCreateGlobalThemeVertex.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },



    [tryCreateTaskVertex.pending]: (state) => {
      // When loading do something
    },
    [tryCreateTaskVertex.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == "") {
        state.is_show_modal_for_creating_verticies = false;
        state.workspace_mindmap_data = null;
        state.is_have_to_update_mindmap_data = true;
      } else {
        console.log(payload.message);
      }

    },
    [tryCreateTaskVertex.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },




    [tryCreateArticleVertex.pending]: (state) => {
      // When loading do something
    },
    [tryCreateArticleVertex.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == "") {
        state.is_show_modal_for_creating_verticies = false;
        state.workspace_mindmap_data = null;
        state.is_have_to_update_mindmap_data = true;
      } else {
        console.log(payload.message);
      }

    },
    [tryCreateArticleVertex.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },



    [tryGetArticleData.pending]: (state) => {
      // When loading do something
    },
    [tryGetArticleData.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == "") {
        state.loaded_articles[payload.id] = payload.data;
      } else {
        state.loaded_articles[payload.id] = {"is_not_loaded":true};
        console.log(payload.message);
      }

    },
    [tryGetArticleData.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },

    [tryDeleteVertex.pending]: (state) => {
      // When loading do something
    },
    [tryDeleteVertex.fulfilled]: (state, { payload }) => {
      console.log(payload)
      if (payload.message == "") {
        state.workspace_mindmap_data = null;
        state.is_have_to_update_mindmap_data = true;
      } else {
        console.log(payload.message);
      }

    },
    [tryDeleteVertex.rejected]: (state) => {
      console.log("Problem with tryGetAvailableGroups");
    },



  }
});

export const {
  startLookingAtGottenRequests,
  endLookingAtGottenRequests,
  updateScienceGroupData,
  closeModalForCreatingVerticies,
  showModalForCreatingGlobalTheme,
  showModalForCreatingTask,
  showModalForCreatingArticle,
} = scienceGroupDataSlice.actions;

export const modalsContentForMindMapVerticies = {
  [""]: {
    typeName: "Не выбран тип",
    content: (<></>),
  },
  [modalContentTypes.GlobalTheme]: {
    typeName: "Глобальная тема",
    content: (<><GlobalThemeModalContent/></>),
  },
  [modalContentTypes.Task]: {
    typeName: "Задача",
    content: (<><TaskModalContent/></>),
  },
  [modalContentTypes.Article]: {
    typeName: "Ссылка на статью",
    content: (<><ArticleModalContent/></>),
  },
};
export default scienceGroupDataSlice.reducer;