import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// internal
import BackToTopCom from '@/global/components/common/back-to-top';
import ProductModal from '@/global/components/common/product-modal';
import Loader from '@/global/components/loader/loader';
import useAuthCheck from '@/global/hooks/use-auth-check';
import { get_cart_products, initialOrderQuantity } from '@/redux/features/cart/cartSlice';
import { get_compare_products } from '@/redux/features/compareSlice';
import { get_wishlist_products } from '@/redux/features/wishlist/wishlistSlice';

const Wrapper = ({ children }) => {
    const dispatch = useDispatch();
    const authChecked = useAuthCheck();
    const { productItem } = useSelector(state => state.productModal);

    useEffect(() => {
        dispatch(get_cart_products());
        dispatch(get_wishlist_products());
        dispatch(get_compare_products());
        dispatch(initialOrderQuantity());
    }, [dispatch]);

    return !authChecked ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <Loader spinner="fade" loading={!authChecked} />
        </div>
    ) : (
        <div id="wrapper">
            {children}
            <BackToTopCom />
            <ToastContainer />
            {productItem && <ProductModal />}
        </div>
    );
};

export default Wrapper;
