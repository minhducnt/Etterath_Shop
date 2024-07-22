import { useState, useMemo } from 'react';
// internal
import Footer from '@/global/layout/footers/footer';
import Header from '@/global/layout/headers/header';
import Wrapper from '@/global/layout/wrapper';

import NiceSelect from '@/global/utils/ui/nice-select';

import ProductItem from '@/global/components/products/product-item';
import SEO from '@/global/components/seo';
import SearchPrdLoader from '@/global/components/loader/search-prd-loader';
import ShopBreadcrumb from '@/global/components/breadcrumb/shop-breadcrumb';
import ErrorMsg from '@/global/components/common/error-msg';

import { useGetAllProductsQuery } from '@/redux/features/productApi';
import EmptyProduct from '@/global/components/error/empty-products';

export default function SearchPage({ query }) {
    const { searchText, productType } = query;
    const [shortValue, setShortValue] = useState('');

    const { data: listProductData, isError, isLoading } = useGetAllProductsQuery();

    const perView = 8;
    const [next, setNext] = useState(perView);

    // set products
    const products = useMemo(() => {
        if (listProductData && Array.isArray(listProductData.data)) {
            return listProductData.data.flat();
        }
        return [];
    }, [listProductData]);

    const filteredProducts = useMemo(() => {
        if (!searchText) return products;
        return products.filter(prd => {
            const matchesName = prd?.product_name?.toLowerCase().includes(searchText.toLowerCase());
            if (!productType) return matchesName;
            return matchesName && prd?.product_type === productType;
        });
    }, [products, searchText, productType]);

    // select handler
    const shortHandler = e => {
        setShortValue(e.value);
    };

    // load more
    const handleLoadMore = () => {
        setNext(value => value + 4);
    };

    // decide what to render
    let content = null;

    if (isLoading) {
        content = <SearchPrdLoader loading={isLoading} />;
    } else if (isError) {
        content = <ErrorMsg msg="Something went wrong! Please try again!" />;
    } else if (filteredProducts.length === 0) {
        content = <EmptyProduct />;
    } else {
        let all_products = filteredProducts;
        let product_items = all_products[0];

        // Search by product name
        if (searchText && !productType) {
            product_items = all_products.filter(prd => prd.product_name?.toLowerCase().includes(searchText?.toLowerCase()));
        }
        // Search by product type
        if (searchText && productType) {
            product_items = all_products.filter(p => p?.product_name?.toLowerCase().includes(searchText?.toLowerCase()));
        }
        // Price low to high
        if (shortValue === 'Price low to high') {
            product_items = product_items.slice().sort((a, b) => Number(a.price) - Number(b.price));
        }
        // Price high to low
        if (shortValue === 'Price high to low') {
            product_items = product_items.slice().sort((a, b) => Number(b.price) - Number(a.price));
        }
        // Not found
        if (product_items.length === 0) {
            content = (
                <div className="text-center pt-80 pb-80">
                    <h3>
                        Sorry, nothing matched <span style={{ color: '#0989FF' }}>{searchText}</span> search terms
                    </h3>
                </div>
            );
        } else {
            content = (
                <>
                    <section className="tp-shop-area pb-120">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-12 col-lg-12">
                                    <div className="tp-shop-main-wrapper">
                                        <div className="tp-shop-top mb-45">
                                            <div className="row">
                                                <div className="col-xl-6">
                                                    <div className="tp-shop-top-left d-flex align-items-center ">
                                                        <div className="tp-shop-top-result">
                                                            <p>
                                                                Showing 1–{product_items.length} of {all_products.length} results
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
                                                        <div className="tp-shop-top-select">
                                                            <NiceSelect
                                                                options={[
                                                                    { value: 'Short By Price', text: 'Short By Price' },
                                                                    { value: 'Price low to high', text: 'Price low to high' },
                                                                    { value: 'Price high to low', text: 'Price high to low' }
                                                                ]}
                                                                defaultCurrent={0}
                                                                onChange={shortHandler}
                                                                name="Short By Price"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tp-shop-items-wrapper tp-shop-item-primary">
                                            <div className="row">
                                                {product_items.slice(0, next)?.map(item => (
                                                    <div key={item.product_id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                                        <ProductItem product={item} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* load more btn start */}
                                        {next < product_items?.length && (
                                            <div className="load-more-btn text-center pt-50">
                                                <button onClick={handleLoadMore} className="tp-btn tp-btn-2 tp-btn-blue">
                                                    Load More
                                                </button>
                                            </div>
                                        )}
                                        {/* load more btn end */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            );
        }
    }

    return (
        <Wrapper>
            <SEO pageTitle="Wishlist" />
            <Header style_2={true} />
            <ShopBreadcrumb title="Search Products" subtitle="Search Products" />
            {content}
            <Footer primary_style={true} />
        </Wrapper>
    );
}

export const getServerSideProps = async context => {
    const { query } = context;

    return {
        props: {
            query
        }
    };
};
