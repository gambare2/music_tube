
import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "../slice/PlaylistSlice";
import authReducer from "../slice/AuthSlice";

const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
