import { apiSlice } from '../../apis/apiSlice';

export const wishlistApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getWishlist: builder.query({
            query: () => `http://localhost:8000/api/account/wishlist/`
        }),

        addToWishlist: builder.mutation({
            query: item => ({
                url: `http://localhost:8000/api/account/wishlist/${item}`,
                method: 'POST'
            })
        }),

        removeFromWishlist: builder.mutation({
            query: item => ({
                url: `http://localhost:8000/api/account/wishlist/${item}`,
                method: 'DELETE'
            })
        })
    })
});

export const { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } = wishlistApi;
