import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';

// internal
import ProductItem from './product-item';
import { useGetAllProductOffersQuery } from '@/redux/features/productApi';
import ErrorMsg from '@/global/components/common/error-msg';
import onErrorItem from '@assets/img/error/onErrorItem.svg';
import HomeOfferPrdLoader from '@/global/components/loader/home/home-offer-prd-loader';
import { ArrowRightSmTwo } from '@svgs';

// slider setting
const sliderSetting = {
    slidesPerView: 4,
    spaceBetween: 24,
    scrollbar: {
        el: '.tp-deals-slider-dot',
        clickable: true
    },
    breakpoints: {
        1200: {
            slidesPerView: 4
        },
        992: {
            slidesPerView: 4
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

const OfferProducts = () => {
    const [productOffers, setProductOffers] = useState([[]]);
    const { data: listProductData, isError, isLoading } = useGetAllProductOffersQuery();

    useEffect(() => {
        const offers = listProductData?.data?.flat().filter(Boolean) ?? [];
        setProductOffers(offers.length > 0 ? offers : []);
    }, [listProductData]);

    let content = null;

    if (isLoading) {
        content = <HomeOfferPrdLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong! Please try again!" />;
    }
    if (!isLoading && !isError && productOffers?.length === 0) {
        content = <ErrorMsg msg="No Products found!" />;
    }
    if (!isLoading && !isError && productOffers?.length > 0) {
        content = (
            <Swiper {...sliderSetting} modules={[Pagination]} className="tp-best-slider-active swiper-container mb-10">
                {productOffers.map((item, i) => (
                    <SwiperSlide key={i}>
                        <ProductItem product={item} offer_style={true} />
                    </SwiperSlide>
                ))}

                <div className="tp-deals-slider-dot tp-swiper-dot text-center mt-40"></div>
            </Swiper>
        );
    }

    return (
        <>
            <section className="tp-product-offer grey-bg-2 pt-55 pb-30">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-xl-4 col-md-5 col-sm-6">
                            <div className="tp-section-title-wrapper mb-40">
                                <h3 className="tp-section-title">Deal of The Day</h3>
                            </div>
                        </div>

                        <div className="col-xl-8 col-md-7 col-sm-6">
                            <div className="tp-product-offer-more-wrapper d-flex justify-content-sm-end p-relative z-index-1">
                                <div className="tp-product-offer-more mb-40 text-sm-end grey-bg-2 ">
                                    <Link href="/shop" className="tp-btn tp-btn-2 tp-btn-blue" style={{ textDecoration: 'none' }}>
                                        <span style={{ marginRight: '4px' }}>Explore more</span> <ArrowRightSmTwo />
                                    </Link>
                                    <span className="tp-product-offer-more-border"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-12">
                            <div className="tp-product-offer-slider fix">{content}</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OfferProducts;
