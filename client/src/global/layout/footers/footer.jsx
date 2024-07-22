import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import { useGetCategoriesQuery } from '@/redux/features/categoryApi';

import logo from '@assets/img/logo/logo.svg';
import pay from '@assets/img/footer/footer-pay.png';
import social_data from '@/global/data/social-data';
import { Email, Location } from '@svgs';

const Footer = ({ style_2 = false, style_3 = false, primary_style = false }) => {
    const [categories, setCategories] = useState([]);
    const { data: lstCategory } = useGetCategoriesQuery();

    useEffect(() => {
        const categories = lstCategory?.data?.flat().filter(Boolean) ?? [];
        setCategories(categories.length > 0 ? categories : undefined);
    }, [lstCategory]);

    return (
        <footer>
            <div
                className={`tp-footer-area ${primary_style ? 'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6' : ''} ${
                    style_2 ? 'tp-footer-style-2' : style_3 ? 'tp-footer-style-2 tp-footer-style-3' : ''
                }`}
                data-bg-color={`${style_2 ? 'footer-bg-white' : 'footer-bg-grey'}`}
            >
                <div className="tp-footer-top pt-65 pb-28">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                                <div className="tp-footer-widget footer-col-1 mb-30">
                                    <div className="tp-footer-widget-content">
                                        <div className="tp-footer-logo">
                                            <Link href="/" as="/">
                                                <Image src={logo} alt="logo" width={160} priority />
                                            </Link>
                                        </div>
                                        <p className="tp-footer-desc" style={{ fontSize: '1rem', marginTop: '-10px' }}>
                                            We are university students specializing in web development and design, working on a capstone
                                            project to create high-quality web applications..
                                        </p>
                                    </div>
                                </div>
                                <div className="tp-footer-social">
                                    {social_data.map(s => (
                                        <a href={s.link} key={s.id} target="_blank">
                                            <i className={s.icon}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                                <div className="tp-footer-widget footer-col-2 mb-50">
                                    <h4 className="tp-footer-widget-title">My Account</h4>
                                    <div className="tp-footer-widget-content">
                                        <ul style={{ paddingLeft: 0 }}>
                                            <li>
                                                <a href="/profile" style={{ textDecoration: 'none' }}>
                                                    Orders
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/wishlist" style={{ textDecoration: 'none' }}>
                                                    Wishlist
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/cart" style={{ textDecoration: 'none' }}>
                                                    Cart
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/coupon" style={{ textDecoration: 'none' }}>
                                                    Coupons
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/compare" style={{ textDecoration: 'none' }}>
                                                    Compare
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                                <div className="tp-footer-widget footer-col-3 mb-50">
                                    <h4 className="tp-footer-widget-title">Categories</h4>
                                    <div className="tp-footer-widget-content">
                                        <ul style={{ paddingLeft: 0 }}>
                                            {categories &&
                                                categories.slice(0, 5).map(category => (
                                                    <li key={category.category_id}>
                                                        <a
                                                            href={`/category/${category.category_name}`}
                                                            as={`/category/${category.category_name}`}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            {category.category_name}
                                                        </a>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                                <div className="tp-footer-widget footer-col-4 mb-40">
                                    <h4 className="tp-footer-widget-title">Talk To Us</h4>
                                    <div className="tp-footer-widget-content">
                                        <div className="tp-footer-talk mb-16">
                                            <span>Got Questions? Call us</span>
                                            <h4 className="pt-2">
                                                <a href="tel:+8402838968641" style={{ textDecoration: 'none', color: 'black' }}>
                                                    (+84 - 028) 38968641
                                                </a>
                                            </h4>
                                        </div>
                                        <div className="tp-footer-contact">
                                            <div className="tp-footer-contact-item d-flex align-items-start">
                                                <div className="tp-footer-contact-icon pr-5">
                                                    <span>
                                                        <Email />
                                                    </span>
                                                </div>
                                                <div className="tp-footer-contact-content">
                                                    <p>
                                                        <a
                                                            href="mailto:ptchc@hcmute.edu.vn"
                                                            style={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
                                                        >
                                                            ptchc@hcmute.edu.vn
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="tp-footer-contact-item d-flex align-items-start">
                                                <div className="tp-footer-contact-icon pr-5">
                                                    <span>
                                                        <Location />
                                                    </span>
                                                </div>
                                                <div className="tp-footer-contact-content">
                                                    <p>
                                                        <a
                                                            href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+S%C6%B0+ph%E1%BA%A1m+K%E1%BB%B9+thu%E1%BA%ADt+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8506324,106.7670422,17z/data=!3m1!4b1!4m6!3m5!1s0x31752763f23816ab:0x282f711441b6916f!8m2!3d10.8506324!4d106.7719131!16s%2Fm%2F02pz17z?entry=ttu"
                                                            target="_blank"
                                                            style={{ textDecoration: 'none', color: 'black', fontSize: '1rem' }}
                                                        >
                                                            1 Vo Van Ngan, Linh Chieu Ward, <br /> Thu Duc City, Ho Chi Minh City.
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-2 pt-2">
                                                <div className="tp-footer-payment text-md-end">
                                                    <p>
                                                        <Image src={pay} alt="pay" />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
