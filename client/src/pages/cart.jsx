import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// internal
import SEO from '@/global/components/seo';
import HeaderTwo from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';
import CartArea from '@/global/components/cart-wishlist/cart-area';
import CommonBreadcrumb from '@/global/components/breadcrumb/common-breadcrumb';
import Loader from '@/global/components/loader/loader';
import { notifyError } from '@/global/utils/toastify';

const CartPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isAuthenticate = Cookies.get('userAuth');
        if (!isAuthenticate) {
            notifyError('You need to login first');
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <Loader spinner="fade" loading={isLoading} />
            </div>
        );
    }

    return (
        <Wrapper>
            <SEO pageTitle="Cart" />
            <HeaderTwo style_2={true} />
            <CommonBreadcrumb title="Shopping Cart" subtitle="My Cart" />
            <CartArea />
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default CartPage;