import { configureStore } from '@reduxjs/toolkit';

import authSlice from './AuthSlice';

import headerSlice from './common/HeaderSlice';

const combinedReducer = {
  authSlice: authSlice,
  header: headerSlice
};

export const store = configureStore({
  reducer: combinedReducer
});
