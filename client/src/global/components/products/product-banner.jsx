import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// internal
import offer_img from '@assets/img/banner/banner-slider-offer.png';
import banner_img_1 from '@assets/img/banner/banner-slider-1.png';
import banner_img_2 from '@assets/img/banner/banner-slider-3.png';

import { Helper } from '@/global/utils/helpers/misc';
import { SliderNextBtn, SliderPrevBtn } from '@assets/svgs/_index';

// banner products
const bannerProducts = [
    {
        id: 1,
        banner_bg_txt: 'tablet',
        subtitle: 'Tablet Collection 2023',
        title: 'Galaxy Tab S6 Lite Android Tablet',
        oldPrice: 320000,
        newPrice: 288000,
        img: banner_img_1
    },
    {
        id: 2,
        banner_bg_txt: 'tablet',
        subtitle: 'Tablet Collection 2023',
        title: 'Galaxy Tab S6 Lite Android Tablet',
        oldPrice: 320000,
        newPrice: 288000,
        img: banner_img_2
    }
];

// slider setting

const ProductBanner = () => {
    const [active, setActive] = useState(false);

    const handleActiveIndex = index => {
        index === 2 ? setActive(true) : setActive(false);
    };

    return (
        <>
            <div className="tp-product-banner-area pt-80 pb-50">
                <div className="container">
                    <div className="tp-product-banner-slider fix">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            effect="fade"
                            loop={true}
                            pagination={{ el: '.tp-slider-dot', clickable: true }}
                            navigation={{
                                nextEl: '.tp-slider-button-next',
                                prevEl: '.tp-slider-button-prev'
                            }}
                            onSlideChange={swiper => handleActiveIndex(swiper.activeIndex)}
                            modules={[Navigation, Pagination, EffectFade]}
                            className="tp-slider-active tp-slider-variation swiper-container"
                        >
                            {bannerProducts.map((item, i) => (
                                <SwiperSlide key={item.id} className="tp-product-banner-inner theme-bg p-relative z-index-1 fix">
                                    <h4 className="tp-product-banner-bg-text">{item.banner_bg_txt}</h4>
                                    <div className="row align-items-center">
                                        <div className="col-xl-6 col-lg-6">
                                            <div className="tp-product-banner-content p-relative z-index-1">
                                                <span className="tp-product-banner-subtitle">{item.subtitle}</span>

                                                <h3 className="tp-product-banner-title">{item.title}</h3>

                                                <div className="tp-product-banner-price mb-40">
                                                    <span className="old-price ">{Helper.formatCurrency(item.oldPrice)}</span>
                                                    <p className="new-price pt-3">{Helper.formatCurrency(item.newPrice)}</p>
                                                </div>

                                                <div className="tp-product-banner-btn">
                                                    <Link href="/shop" className="tp-btn tp-btn-2" style={{ textDecoration: 'none' }}>
                                                        Shop now
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6">
                                            <div className="tp-product-banner-thumb-wrapper p-relative">
                                                <div className="tp-product-banner-thumb-shape">
                                                    <span className="tp-product-banner-thumb-gradient"></span>
                                                    <Image className="tp-offer-shape" src={offer_img} alt="tp-offer-shape" />
                                                </div>

                                                <div className="tp-product-banner-thumb text-end p-relative z-index-1">
                                                    <Image src={item.img} alt="banner-slider img" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}

                            <div className="tp-slider-arrow tp-swiper-arrow">
                                <button type="button" className="tp-slider-button-prev">
                                    <SliderPrevBtn />
                                </button>
                                <button type="button" className="tp-slider-button-next">
                                    <SliderNextBtn />
                                </button>
                            </div>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductBanner;
