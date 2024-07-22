import { Helper } from '@/global/utils/helpers/misc';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import Cookies from 'js-cookie';

export const baseURL = process.env.STORE_API_URL;

export const apiSlice = createApi({
    reducerPath: 'api',

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,

        prepareHeaders: async (headers, { getState, endpoint }) => {
            try {
                const userAuth = Cookies.get('userAuth');

                if (userAuth) {
                    const user = JSON.parse(userAuth);
                    const accessToken = user.accessToken;
                    const refreshToken = user.refreshToken;

                    if (accessToken && !Helper.isTokenExpired(accessToken)) {
                        headers.set('Authorization', `Bearer ${accessToken}`);
                    } else if (!refreshToken && accessToken != null && Helper.isTokenExpired(accessToken)) {
                        Cookies.remove('userAuth');
                        globalNavigate('/login');
                    }
                }
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
            return headers;
        }
    }),

    endpoints: () => ({}),

    tagTypes: [
        'Products',
        'Product',
        'Coupon',
        'UserOrder',
        'UserOrders',
        'ProductType',
        'OfferProducts',
        'PopularProducts',
        'TopRatedProducts'
    ]
});
