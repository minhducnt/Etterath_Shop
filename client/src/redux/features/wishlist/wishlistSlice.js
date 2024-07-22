import { getLocalStorage, setLocalStorage } from '@/global/utils/local_storage';
import { notifyError, notifySuccess } from '@/global/utils/toastify';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    wishlist: []
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        add_to_wishlist: (state, { payload }) => {
            const isExist = state.wishlist.some(item => item.product_id === payload.product_id);
            if (!isExist) {
                state.wishlist.push(payload);
                notifySuccess(`${payload.product_name} added to wishlist`);
            } else {
                state.wishlist = state.wishlist.filter(item => item.product_id !== payload.product_id);
                notifyError(`${payload.product_name} removed from wishlist`);
            }
            setLocalStorage('wishlist_items', state.wishlist);
        },

        remove_wishlist_product: (state, { payload }) => {
            state.wishlist = state.wishlist.filter(item => item.product_id !== payload.product_id);
            setLocalStorage('wishlist_items', state.wishlist);
            notifyError(`${payload.product_name} removed from wishlist`);
        },

        get_wishlist_products: (state, { payload }) => {
            state.wishlist = getLocalStorage('wishlist_items');
        }
    }
});

export const { add_to_wishlist, remove_wishlist_product, get_wishlist_products } = wishlistSlice.actions;
export default wishlistSlice.reducer;
