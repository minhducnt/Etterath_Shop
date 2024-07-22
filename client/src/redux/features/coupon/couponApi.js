import { apiSlice } from '@/redux/apis/apiSlice';

export const authApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        //* get offer coupon
        getOfferCoupons: builder.query({
            query: () => `http://localhost:8000/api/account/coupons/`,
            providesTags: ['Coupon'],
            keepUnusedDataFor: 600
        })
    })
});

export const { useGetOfferCouponsQuery } = authApi;
