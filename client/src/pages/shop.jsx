import React, { useState, useEffect } from 'react';
// internal
import SEO from '@/global/components/seo';
import Wrapper from '@/global/layout/wrapper';
import Header from '@/global/layout/headers/header';
import ShopBreadcrumb from '@/global/components/breadcrumb/shop-breadcrumb';
import { useGetAllProductsQuery } from '@/redux/features/productApi';
import ShopList from '@/global/components/shop/shop-list';
import ShopFilterOffCanvas from '@/global/components/common/shop-filter-offcanvas';
import Footer from '@/global/layout/footers/footer';
import ShopHiddenLoader from '@/global/components/loader/shop/shop-hidden-loader';
import ErrorView from '@/global/components/error/error-view';
import EmptyProducts from '@/global/components/error/empty-products';

const ShopPage = ({ query }) => {
    const [products, setProducts] = useState([]);
    const { data: listProductData, isError, isLoading } = useGetAllProductsQuery();

    const [selectValue, setSelectValue] = useState('');
    const [currPage, setCurrPage] = useState(1);
    const [priceValue, setPriceValue] = useState([0, 0]);

    useEffect(() => {
        // handle products
        const products = listProductData?.data?.flat().filter(Boolean) ?? [];
        setProducts(products.length > 0 ? products : []);

        // handle price value
        const maxPrice = products.reduce((max, product) => {
            return product.price > max ? product.price : max;
        }, 0);
        setPriceValue([0, maxPrice]);
    }, [listProductData]);

    // selectHandleFilter
    const selectHandleFilter = e => {
        setSelectValue(e.value);
    };

    // handleChanges
    const handleChanges = val => {
        setCurrPage(1);
        setPriceValue(val);
    };

    // other props
    const otherProps = {
        priceFilterValues: {
            priceValue,
            handleChanges
        },
        selectHandleFilter,
        currPage,
        setCurrPage
    };

    // decide what to render
    let content = null;

    if (isLoading) {
        content = <ShopHiddenLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorView />;
    }
    if (!isLoading && !isError && products?.length === 0) {
        content = <EmptyProducts />;
    }
    if (!isLoading && !isError && products?.length > 0) {
        // products
        let product_items = products;

        // select short filtering
        switch (selectValue) {
            case 'Default Sorting':
                product_items = products;
                break;
            case 'Low to High':
                product_items = products?.slice().sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'High to Low':
                product_items = products?.slice().sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case 'New Added':
                product_items = products?.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'On Sale':
                product_items = products?.filter(p => p.discount_price > 0);
                break;
            default:
                product_items = products;
        }

        // price filter
        product_items = product_items.filter(p => p.price >= priceValue[0] && p.price <= priceValue[1]);

        // status filter
        if (query.status) {
            if (query.status === 'on-sale') {
                product_items = product_items.filter(p => p.discount_price > 0);
            } else if (query.status === 'in-stock') {
                product_items = product_items;
            }
        }

        // category filter
        if (query.category) {
            product_items = product_items.filter(
                p => p.category_name.toLowerCase().replace('&', '').split(' ').join('-') === query.category
            );
        }

        // brand filter
        if (query.brand) {
            product_items = product_items.filter(p => p.brand_name.toLowerCase().replace('&', '').split(' ').join('-') === query.brand);
        }

        content = (
            <>
                <ShopList all_products={products} products={product_items} otherProps={otherProps} />
                <ShopFilterOffCanvas all_products={products} otherProps={otherProps} />
            </>
        );
    }
    return (
        <Wrapper>
            <SEO pageTitle="Shop" />
            <Header style_2={true} />
            <ShopBreadcrumb title="Products" subtitle="Product" />
            {content}
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default ShopPage;

export const getServerSideProps = async context => {
    const { query } = context;

    return {
        props: {
            query
        }
    };
};
