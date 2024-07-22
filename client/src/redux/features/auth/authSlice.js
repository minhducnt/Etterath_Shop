import { createSlice } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';

const initialState = {
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
    addresses: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, { payload }) => {
            state.accessToken = payload.access_token;
            state.refreshToken = payload.refresh_token;
        },

        userProfile: (state, { payload }) => {
            state.user = payload;
        },

        userAddress: (state, { payload }) => {
            state.addresses = payload;
        },

        userLoggedOut: state => {
            state.accessToken = undefined;
            state.refreshToken = undefined;
            state.user = undefined;

            localStorage.clear();
            Cookies.remove('userAuth');
        }
    }
});

export const { userLoggedIn, userLoggedOut, userProfile, userAddress } = authSlice.actions;
export default authSlice.reducer;
