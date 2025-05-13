import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  devTools: import.meta.env.MODE !== 'production'
});