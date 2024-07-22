import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    productItem: null,
    productDetail: null,
    isModalOpen: false
};

export const productModalSlice = createSlice({
    name: 'productModal',
    initialState,
    reducers: {
        handleProductModal: (state, { payload }) => {
            const { productItem, productDetail } = payload;
            state.productItem = productItem;
            state.productDetail = productDetail;
            state.isModalOpen = true;
        },

        handleModalClose: (state, { payload }) => {
            state.isModalOpen = false;
            state.productItem = null;
        }
    }
});

export const { handleProductModal, handleModalClose } = productModalSlice.actions;
export default productModalSlice.reducer;
