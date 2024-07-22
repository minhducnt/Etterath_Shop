import { apiSlice } from '@/redux/apis/apiSlice';

import { jwtDecode } from 'jwt-decode';

import Cookies from 'js-cookie';

import { userAddress, userLoggedIn, userProfile } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        //* login
        loginUser: builder.mutation({
            query: data => ({
                url: 'http://localhost:8000/api/auth/sign-in/',
                method: 'POST',
                body: data
            }),

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    const { refresh_token, access_token } = result.data.data[0];
                    const decoded = jwtDecode(refresh_token);

                    Cookies.set(
                        'userAuth',
                        JSON.stringify({
                            accessToken: access_token,
                            refreshToken: refresh_token
                        }),
                        { ExpiresAt: decoded.ExpiresAt }
                    );

                    dispatch(
                        userLoggedIn({
                            accessToken: access_token,
                            refreshToken: refresh_token
                        })
                    );
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        //* register
        registerUser: builder.mutation({
            query: data => ({
                url: 'http://localhost:8000/api/auth/sign-up/',
                method: 'POST',
                body: data
            }),

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    //
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        //* user profile
        getUser: builder.query({
            query: () => 'http://localhost:8000/api/account/',

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    dispatch(
                        userProfile({
                            user: result.data.data[0]
                        })
                    );
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        //* update user profile
        updateProfile: builder.mutation({
            query: ({ ...data }) => ({
                url: `http://localhost:8000/api/account/`,
                method: 'PUT',
                body: data
            }),

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    return result;
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        //* get user address
        getUserAddress: builder.query({
            query: () => 'http://localhost:8000/api/account/address',

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    dispatch(
                        userAddress({
                            addresses: result.data.data
                        })
                    );
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        //* create user address
        createUserAddress: builder.mutation({
            query: ({ ...data }) => ({
                url: 'http://localhost:8000/api/account/address',
                method: 'POST',
                body: data
            }),

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    //
                } catch (err) {
                    console.log(err);
                }
            }
        }),

        //* update user address
        updateUserAddress: builder.mutation({
            query: ({ ...data }) => ({
                url: `http://localhost:8000/api/account/address`,
                method: 'PUT',
                body: data
            }),

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    //
                } catch (err) {
                    console.log(err);
                }
            }
        })
    })
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useGetUserQuery,
    useUpdateProfileMutation,
    useGetUserAddressQuery,
    useCreateUserAddressMutation,
    useUpdateUserAddressMutation
} = authApi;
