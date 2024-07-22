import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from './apis/apiSlice';
import compareSlice from './features/compareSlice';
import productModalSlice from './features/productModalSlice';
import shopFilterSlice from './features/shop-filter-slice';
import authSlice from './features/auth/authSlice';
import cartSlice from './features/cart/cartSlice';
import couponSlice from './features/coupon/couponSlice';
import orderSlice from './features/order/orderSlice';
import wishlistSlice from './features/wishlist/wishlistSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice,
        productModal: productModalSlice,
        shopFilter: shopFilterSlice,
        cart: cartSlice,
        wishlist: wishlistSlice,
        compare: compareSlice,
        coupon: couponSlice,
        order: orderSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;
