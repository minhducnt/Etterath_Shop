import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// internal
import CartMiniSidebar from '@/global/components/common/cart-mini-sidebar';
import useCartInfo from '@/global/hooks/use-cart-info';
import useSearchFormSubmit from '@/global/hooks/use-search-form-submit';
import useSticky from '@/global/hooks/use-sticky';
import { openCartMini } from '@/redux/features/cart/cartSlice';

import HeaderMainRight from './header-com/header-main-right';
import Menus from './header-com/menus';

import logo from '@assets/img/logo/logo.svg';
import { CartTwo, Compare, Menu, Search, Wishlist } from '@svgs';

const Header = ({ style_2 = false }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const { quantity } = useCartInfo();
    const { sticky } = useSticky();
    const { wishlist } = useSelector(state => state.wishlist);

    const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();

    const handleCart = async () => {
        return dispatch(openCartMini());
    };

    return (
        <>
            <header>
                <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`}>
                    <div id="header-sticky" className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}>
                        <div className="container">
                            <div className="tp-mega-menu-wrapper p-relative">
                                <div className="row align-items-center">
                                    <div className="col-xl-2 col-lg-5 col-md-5 col-sm-4 col-6">
                                        <div className="logo">
                                            <Link href="/" as="/">
                                                <Image src={logo} alt="logo" priority />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="col-xl-5 d-none d-xl-block">
                                        <div className="main-menu menu-style-2 mt-3">
                                            <nav className="tp-main-menu-content">
                                                <Menus />
                                            </nav>
                                        </div>
                                    </div>

                                    <div className="col-xl-5 col-lg-7 col-md-7 col-sm-8 col-6">
                                        <div className="tp-header-bottom-right d-flex align-items-center justify-content-end ml-30">
                                            <div className="tp-header-search-2 d-none d-sm-block">
                                                <form onSubmit={handleSubmit}>
                                                    <input
                                                        onChange={e => setSearchText(e.target.value)}
                                                        value={searchText}
                                                        type="text"
                                                        placeholder="Search for items..."
                                                    />
                                                    <button type="submit">
                                                        <Search />
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="tp-header-action d-flex align-items-center ml-30">
                                                <div className="tp-header-action-item d-none d-lg-block">
                                                    <Link href="/compare" className="tp-header-action-btn">
                                                        <Compare />
                                                    </Link>
                                                </div>

                                                <div className="tp-header-action-item d-none d-lg-block">
                                                    <Link href="/wishlist" className="tp-header-action-btn">
                                                        <Wishlist />
                                                        <span className="tp-header-action-badge">{wishlist.length}</span>
                                                    </Link>
                                                </div>

                                                <div className="tp-header-action-item">
                                                    {!user ? (
                                                        <Link href="/cart" className="tp-header-action-btn">
                                                            <CartTwo />
                                                            <span className="tp-header-action-badge">{quantity}</span>
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCart()}
                                                            className="tp-header-action-btn cartmini-open-btn"
                                                        >
                                                            <CartTwo />
                                                            <span className="tp-header-action-badge">{quantity}</span>
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="tp-header-action-item">
                                                    <HeaderMainRight />
                                                </div>

                                                <div className="tp-header-action-item tp-header-hamburger mr-20 d-xl-none">
                                                    <button type="button" className="tp-header-action-btn tp-offcanvas-open-btn">
                                                        <Menu />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <CartMiniSidebar />
        </>
    );
};

export default Header;
