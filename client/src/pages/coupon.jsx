import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// internal
import SEO from '@/global/components/seo';
import Header from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';
import ShopBreadcrumb from '@/global/components/breadcrumb/shop-breadcrumb';
import CouponArea from '@/global/components/coupon/coupon-area';
import Loader from '@/global/components/loader/loader';
import { notifyError } from '@/global/utils/toastify';

const CouponPage = () => {
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
            <SEO pageTitle="Coupon" />
            <Header style_2={true} />
            <ShopBreadcrumb title="My Coupons" subtitle="Coupon" />
            <CouponArea />
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default CouponPage;
