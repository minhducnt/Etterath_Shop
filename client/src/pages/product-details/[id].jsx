import React, { useEffect, useState } from 'react';
// internal
import SEO from '@/global/components/seo';
import Header from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';
import { useGetProductByIdQuery } from '@/redux/features/productApi';
import ProductDetailsBreadcrumb from '@/global/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/global/components/product-details/product-details-area';
import PrdDetailsLoader from '@/global/components/loader/prd-details-loader';
import EmptyProducts from '@/global/components/error/empty-products';
import ErrorView from '@/global/components/error/error-view';

const ProductDetailsPage = ({ query }) => {
    const [productDetail, setProductDetail] = useState([]);
    const { data: productData, isLoading, isError } = useGetProductByIdQuery(query.id);

    useEffect(() => {
        const products = productData?.data?.flat().filter(Boolean) ?? [];
        setProductDetail(products.length > 0 ? products : []);
    }, [productData]);

    let content = null;

    if (isLoading) {
        content = <PrdDetailsLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorView />;
    }
    if (!isLoading && !isError && productDetail?.length > 0) {
        const productItem = productDetail[0];
        content = (
            <>
                <ProductDetailsBreadcrumb category={productItem.main_category_name} title={productItem.product_name} />
                <ProductDetailsArea productItem={productItem} />
            </>
        );
    }

    return (
        <Wrapper>
            <SEO pageTitle="Product Details" />
            <Header style_2={true} />
            {content}
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default ProductDetailsPage;

export const getServerSideProps = async context => {
    const { query } = context;
    return {
        props: {
            query
        }
    };
};
