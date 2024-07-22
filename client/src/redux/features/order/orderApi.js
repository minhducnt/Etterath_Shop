import { apiSlice } from '../../apis/apiSlice';

export const authApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        //* Save Order
        saveOrder: builder.mutation({
            query: data => {
                const formData = new FormData();
                Object.keys(data).forEach(key => formData.append(key, data[key]));
                return {
                    url: 'http://localhost:8000/api/carts/place-order',
                    method: 'POST',
                    body: formData
                };
            },
            invalidatesTags: ['UserOrders'],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    if (result) {
                        const resdata = result.data.data.flat();
                        const order_id = resdata[0].shop_order_id;

                        localStorage.removeItem('couponInfo');
                        localStorage.removeItem('cart_products');
                        localStorage.removeItem('shipping_info');
                        localStorage.setItem('shop_order_id', order_id);
                    }
                } catch (err) {
                    // do nothing
                }
            }
        }),

        //* Save Order Cod
        saveOrderCod: builder.mutation({
            query: data => {
                const formData = new FormData();
                Object.keys(data).forEach(key => formData.append(key, data[key]));
                return {
                    url: 'http://localhost:8000/api/carts/place-order/cod',
                    method: 'POST',
                    body: formData
                };
            },
            invalidatesTags: ['UserOrders'],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    if (result) {
                        localStorage.removeItem('couponInfo');
                        localStorage.removeItem('cart_products');
                        localStorage.removeItem('shipping_info');
                    }
                } catch (err) {
                    // do nothing
                }
            }
        }),

        //* Save Order Stripe
        saveOrderStripe: builder.mutation({
            query: data => {
                const formData = new FormData();
                Object.keys(data).forEach(key => formData.append(key, data[key]));
                return {
                    url: 'http://localhost:8000/api/carts/place-order/stripe-checkout',
                    method: 'POST',
                    body: formData
                };
            },
            invalidatesTags: ['UserOrders'],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    if (result) {
                        localStorage.removeItem('couponInfo');
                        localStorage.removeItem('cart_products');
                        localStorage.removeItem('shipping_info');
                    }
                } catch (err) {
                    // do nothing
                }
            }
        }),

        //* Verify Order Stripe
        verifyOrderStripe: builder.mutation({
            query: data => {
                const formData = new FormData();
                Object.keys(data).forEach(key => formData.append(key, data[key]));
                return {
                    url: 'http://localhost:8000/api/carts/place-order/stripe-verify',
                    method: 'POST',
                    body: formData
                };
            },
            invalidatesTags: ['UserOrders'],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    if (result) {
                        localStorage.removeItem('couponInfo');
                        localStorage.removeItem('cart_products');
                        localStorage.removeItem('shipping_info');
                    }
                } catch (err) {
                    // do nothing
                }
            }
        }),

        //* getUserOrders
        getUserOrders: builder.query({
            query: () => `http://localhost:8000/api/orders/`,
            providesTags: ['UserOrders'],
            keepUnusedDataFor: 600
        }),

        //* getUserOrderItems
        getUserOrderItemsByShopOrderId: builder.query({
            query: id => `http://localhost:8000/api/orders/${id}/items`,
            providesTags: (result, error, arg) => [{ type: 'UserOrder', id: arg }],
            keepUnusedDataFor: 600
        }),

        //* confirm Order
        updateOrderStatus: builder.mutation({
            query: item => {
                return {
                    url: `http://localhost:8000/api/orders/`,
                    method: 'PUT',
                    body: { shop_order_id: item.shop_order_id, order_status_id: 4 }
                };
            },

            invalidatesTags: ['UserOrders'],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    if (result) {
                        localStorage.removeItem('couponInfo');
                        localStorage.removeItem('cart_products');
                        localStorage.removeItem('shipping_info');
                    }
                } catch (err) {
                    // do nothing
                }
            }
        })
    })
});

export const {
    useSaveOrderMutation,
    useSaveOrderCodMutation,
    useSaveOrderStripeMutation,
    useGetUserOrderItemsByShopOrderIdQuery,
    useGetUserOrdersQuery,
    useVerifyOrderStripeMutation,
    useUpdateOrderStatusMutation
} = authApi;
