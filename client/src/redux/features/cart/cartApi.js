import { apiSlice } from '../../apis/apiSlice';

export const cartApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getCart: builder.query({
            query: () => `http://localhost:8000/api/carts/`
        }),

        addToCart: builder.mutation({
            query: item => {
                const formData = new FormData();
                formData.append('qty', parseInt(item.qty));

                return {
                    url: `http://localhost:8000/api/carts/${item.product_item_id}`,
                    method: 'POST',
                    body: formData
                };
            }
        }),

        removeFromCart: builder.mutation({
            query: item => ({
                url: `http://localhost:8000/api/carts/${item}`,
                method: 'DELETE'
            })
        }),

        updateCart: builder.mutation({
            query: item => {
                return {
                    url: `http://localhost:8000/api/carts/`,
                    method: 'PUT',
                    body: {
                        product_item_id: item.product_item_id,
                        count: item.qty
                    }
                };
            }
        }),

        applyCoupon: builder.mutation({
            query: item => ({
                url: `http://localhost:8000/api/carts/apply-coupon`,
                method: 'PATCH',
                body: item
            })
        })
    })
});

export const { useGetCartQuery, useAddToCartMutation, useRemoveFromCartMutation, useUpdateCartMutation, useApplyCouponMutation } = cartApi;
