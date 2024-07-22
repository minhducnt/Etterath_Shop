import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// internal
import { useGetAllProductsQuery } from '@/redux/features/productApi';
import { NextArr, PrevArr, ShapeLine } from '@svgs';
import ErrorMsg from '@/global/components/common/error-msg';
import ProductItem from './product-item';
import HomeNewArrivalPrdLoader from '@/global/components/loader/home/home-newArrival-prd-loader';

// slider setting
const slider_setting = {
    slidesPerView: 4,
    spaceBetween: 30,
    pagination: {
        el: '.tp-arrival-slider-dot',
        clickable: true
    },
    navigation: {
        nextEl: '.tp-arrival-slider-button-next',
        prevEl: '.tp-arrival-slider-button-prev'
    },
    breakpoints: {
        1200: {
            slidesPerView: 4
        },
        992: {
            slidesPerView: 3
        },
        768: {
            slidesPerView: 2
        },
        576: {
            slidesPerView: 2
        },
        0: {
            slidesPerView: 1
        }
    }
};

const NewArrivals = () => {
    let content = null;

    const [products, setProducts] = useState([]);
    const { data: listProductData, isError, isLoading } = useGetAllProductsQuery();

    useEffect(() => {
        if (listProductData && Array.isArray(listProductData.data)) {
            const productLstTemp = listProductData.data
                .flat()
                .filter(prd => prd !== null)
                .slice(0, 5);
            setProducts(productLstTemp);
        }
    }, [listProductData]);

    if (isLoading) {
        content = <HomeNewArrivalPrdLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong! Please try again!" />;
    }
    if (!isLoading && !isError && products.length === 0) {
        content = <ErrorMsg msg="No Products found!" />;
    }
    if (!isLoading && !isError && products.length > 0) {
        const product_items = products
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter(prd => prd.created_at)
            .slice(0, 8);
        content = (
            <Swiper {...slider_setting} modules={[Navigation, Pagination]} className="tp-product-arrival-active swiper-container">
                {product_items.map(item => (
                    <SwiperSlide key={item.product_id}>
                        <ProductItem product={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    }
    return (
        <>
            <section className="tp-product-arrival-area pb-55">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-xl-5 col-sm-6">
                            <div className="tp-section-title-wrapper mb-40">
                                <h3 className="tp-section-title">New Arrivals</h3>
                            </div>
                        </div>
                        <div className="col-xl-7 col-sm-6">
                            <div className="tp-product-arrival-more-wrapper d-flex justify-content-end">
                                <div className="tp-product-arrival-arrow tp-swiper-arrow mb-40 text-end tp-product-arrival-border">
                                    <button type="button" className="tp-arrival-slider-button-prev">
                                        <PrevArr />
                                    </button>{' '}
                                    <button type="button" className="tp-arrival-slider-button-next">
                                        <NextArr />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="tp-product-arrival-slider fix">{content}</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NewArrivals;
