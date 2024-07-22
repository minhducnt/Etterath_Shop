import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
// internal
import ErrorMsg from '@/global/components/common/error-msg';
import { useGetActiveBrandsQuery } from '@/redux/features/brandApi';
import { handleFilterSidebarClose } from '@/redux/features/shop-filter-slice';
import ShopBrandLoader from '@/global/components/loader/shop/shop-brand-loader';

const BrandFilter = ({ setCurrPage }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [brands, setBrands] = useState([]);
    const { data: listBrands, isError, isLoading } = useGetActiveBrandsQuery();

    useEffect(() => {
        if (listBrands && Array.isArray(listBrands.data)) {
            const result = listBrands.data.flat() ?? [];
            setBrands(result);
        }
    }, [listBrands]);

    const handleBrandRoute = brand => {
        setCurrPage(1);
        router.push(`/shop?brand=${brand.toLowerCase().replace('&', '').split(' ').join('-')}`);
        dispatch(handleFilterSidebarClose());
    };

    let content = null;

    if (isLoading) {
        content = <ShopBrandLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong! Please try again!" />;
    }
    if (!isLoading && !isError && brands?.length === 0) {
        content = <ErrorMsg msg="No Brands found!" />;
    }
    if (!isLoading && !isError && brands?.length > 0) {
        content = brands.map(item => (
            <li key={item.id}>
                <a
                    onClick={() => handleBrandRoute(item.brand_name)}
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                    className={router.query.brands === item.brand_name.toLowerCase().replace('&', '').split(' ').join('-') ? 'active' : ''}
                >
                    {item.brand_name}
                </a>
            </li>
        ));
    }

    return (
        <>
            <div className="tp-shop-widget mb-50">
                <h3 className="tp-shop-widget-title">Popular Brands</h3>
                <div className="tp-shop-widget-content">
                    <div className="tp-shop-widget-categories">
                        <ul style={{ textDecoration: 'none' }}>{content}</ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrandFilter;
