import { getLocalStorage, setLocalStorage } from '@/global/utils/local_storage';
import { notifyError, notifySuccess } from '@/global/utils/toastify';

import { createSlice } from '@reduxjs/toolkit';

import { useAddToCartMutation } from './cartApi';

const initialState = {
    cart_products: [],
    orderQuantity: 1,
    cartMiniOpen: false
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        add_cart_product: (state, { payload }) => {
            const isExist = state.cart_products.some(i => i.product_id === payload.product_id);
            if (!isExist) {
                const newItem = {
                    ...payload,
                    orderQuantity: state.orderQuantity
                };
                state.cart_products.push(newItem);
                notifySuccess(`${payload.product_name} added to cart`);
            } else {
                for (let item of state.cart_products) {
                    if (item.product_id === payload.product_id) {
                        item.orderQuantity += state.orderQuantity !== 1 ? state.orderQuantity : 1;
                        notifySuccess(`${state.orderQuantity} ${item.product_name} added to cart`);
                        break;
                    }
                }
            }
            setLocalStorage('cart_products', state.cart_products);
        },

        increment: (state, { payload }) => {
            state.orderQuantity = state.orderQuantity + 1;
        },

        decrement: (state, { payload }) => {
            state.orderQuantity = state.orderQuantity > 1 ? state.orderQuantity - 1 : (state.orderQuantity = 1);
        },

        quantityDecrement: (state, { payload }) => {
            state.cart_products.forEach(item => {
                if (item.product_id === payload.product_id && item.orderQuantity > 1) {
                    item.orderQuantity -= 1;
                }
            });
            setLocalStorage('cart_products', state.cart_products);
        },

        remove_product: (state, { payload: payload }) => {
            state.cart_products = state.cart_products.filter(item => item.product_id !== payload.product_id);
            setLocalStorage('cart_products', state.cart_products);
            notifyError(`${payload.product_name} removed from cart.`);
        },

        get_cart_products: (state, action) => {
            state.cart_products = getLocalStorage('cart_products');
        },

        initialOrderQuantity: (state, { payload }) => {
            state.orderQuantity = 1;
        },

        clearCart: state => {
            const isClearCart = window.confirm('Are you sure you want to remove all items ?');
            if (isClearCart) {
                state.cart_products = [];
            }
            setLocalStorage('cart_products', state.cart_products);
        },

        openCartMini: (state, { payload }) => {
            state.cartMiniOpen = true;
        },

        closeCartMini: (state, { payload }) => {
            state.cartMiniOpen = false;
        }
    }
});

export const {
    add_cart_product,
    increment,
    decrement,
    get_cart_products,
    remove_product,
    quantityDecrement,
    initialOrderQuantity,
    clearCart,
    closeCartMini,
    openCartMini
} = cartSlice.actions;
export default cartSlice.reducer;
