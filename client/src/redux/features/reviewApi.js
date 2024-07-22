import { apiSlice } from '../apis/apiSlice';

export const reviewApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        findAllReviews: builder.query({
            query: productId => `http://localhost:8000/api/products/${productId}/comments`
        }),

        addReview: builder.mutation({
            query: data => ({
                url: `http://localhost:8000/api/products/${data.productId}/comments`,
                method: 'POST',
                body: {
                    user_id: data.userId,
                    content: data.content,
                    rating: data.rating
                }
            }),
            invalidatesTags: (result, error, arg) => ['Products', { type: 'Product', id: arg.productId }]
        }),

        updateReview: builder.mutation({
            query: data => ({
                url: `http://localhost:8000/api/products/${data.productId}/comments/${data.reviewId}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: (result, error, arg) => ['Products', { type: 'Product', id: arg.productId }]
        }),

        deleteReview: builder.mutation({
            query: data => ({
                url: `http://localhost:8000/api/products/${data.productId}/comments/${data.reviewId}`,
                method: 'DELETE',
                body: data
            }),
            invalidatesTags: (result, error, arg) => ['Products', { type: 'Product', id: arg.productId }]
        })
    })
});

export const { useFindAllReviewsQuery, useAddReviewMutation, useDeleteReviewMutation, useUpdateReviewMutation } = reviewApi;
