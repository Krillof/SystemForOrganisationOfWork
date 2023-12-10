import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./userDataSlice";
import scienceGroupDataSlice from "./scienceGroupDataSlice";

export default configureStore({
  reducer: {
    userData: userDataSlice,
    scienceGroupData: scienceGroupDataSlice,
  },
});