import ErrorMsg from '@/global/components/common/error-msg';
import HomePrdLoader from '@/global/components/loader/home/home-prd-loader';
import { useGetAllProductsQuery } from '@/redux/features/productApi';

import React, { useEffect, useState } from 'react';

import ProductItem from './product-item';

const ProductArea = () => {
    const [activeTab, setActiveTab] = useState('new');

    const [products, setProducts] = useState([]);
    const { data: listProductData, isError, isLoading } = useGetAllProductsQuery();

    useEffect(() => {
        if (listProductData && Array.isArray(listProductData.data)) {
            const productLstTemp = listProductData.data
                .flat()
                .filter(prd => prd !== null)
                .slice(0, 8);
            setProducts(productLstTemp);
        }
    }, [listProductData]);

    let content = null;

    if (isLoading) {
        content = <HomePrdLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong" />;
    }
    if (!isLoading && !isError && products.length === 0) {
        content = <ErrorMsg msg="No Products found!" />;
    }
    if (!isLoading && !isError && products.length > 0) {
        content = products.map((prd, i) => (
            <div key={i} className="col-xl-3 col-lg-3 col-sm-6">
                <ProductItem product={prd} />
            </div>
        ));
    }

    return (
        <section className="tp-product-area pb-55">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-xl-5 col-lg-6 col-md-5">
                        <div className="tp-section-title-wrapper mb-40 pt-40">
                            <h3 className="tp-section-title">Products</h3>
                        </div>
                    </div>
                </div>

                <div className="row">{content}</div>
            </div>
        </section>
    );
};

export default ProductArea;
