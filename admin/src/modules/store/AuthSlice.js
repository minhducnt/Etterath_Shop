import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: window.localStorage.getItem('AccessToken')
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: initialState.value
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setToken: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setUser, setToken } = authSlice.actions;

export default authSlice.reducer;
