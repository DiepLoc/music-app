import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import musicReducer from "../features/music/musicSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    music: musicReducer,
  },
});
