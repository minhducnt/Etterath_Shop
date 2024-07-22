import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// internal
import CategoryFilter from '../shop/shop-filter/category-filter';
import PriceFilter from '../shop/shop-filter/price-filter';
import BrandFilter from '../shop/shop-filter/brand-filter';
import ResetButton from '../shop/shop-filter/reset-button';
import StatusFilter from '../shop/shop-filter/status-filter';
import { handleFilterSidebarClose, handleFilterSidebarOpen } from '@/redux/features/shop-filter-slice';

const ShopFilterOffCanvas = ({ all_products, otherProps, right_side = false }) => {
    const dispatch = useDispatch();

    const { priceFilterValues, setCurrPage } = otherProps;
    const { filterSidebar } = useSelector(state => state.shopFilter);

    // max price
    const maxPrice = all_products.reduce((max, product) => {
        return product.price > max ? product.price : max;
    }, 0);

    return (
        <>
            <div className={`tp-filter-offcanvas-area ${filterSidebar ? 'offcanvas-opened' : ''}`}>
                <div className="tp-filter-offcanvas-wrapper">
                    <div className="tp-filter-offcanvas-close">
                        <button
                            type="button"
                            onClick={() => dispatch(handleFilterSidebarOpen())}
                            className="tp-filter-offcanvas-close-btn filter-close-btn"
                        >
                            <i className="fa-solid fa-xmark"></i> Close
                        </button>
                    </div>
                    <div className="tp-shop-sidebar">
                        {/* filter */}
                        <PriceFilter priceFilterValues={priceFilterValues} maxPrice={maxPrice} />
                        {/* status */}
                        <StatusFilter setCurrPage={setCurrPage} />
                        {/* categories */}
                        <CategoryFilter setCurrPage={setCurrPage} />
                        {/* brand */}
                        <BrandFilter setCurrPage={setCurrPage} />
                        {/* reset filter */}
                        <ResetButton shop_right={right_side} />
                    </div>
                </div>
            </div>

            {/* overlay start */}
            <div onClick={() => dispatch(handleFilterSidebarClose())} className={`body-overlay ${filterSidebar ? 'opened' : ''}`}></div>
            {/* overlay end */}
        </>
    );
};

export default ShopFilterOffCanvas;
