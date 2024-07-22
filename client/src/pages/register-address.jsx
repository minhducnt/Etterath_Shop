import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// internal
import SEO from '@/global/components/seo';
import Header from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';
import CommonBreadcrumb from '@/global/components/breadcrumb/common-breadcrumb';
import RegisterAddressArea from '@/global/components/auth/address-area';
import Loader from '@/global/components/loader/loader';

const RegisterAddressPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isRegistering = Cookies.get('isRegistering');
        const isAuthenticate = Cookies.get('userAuth');

        if (!isRegistering && !isAuthenticate) {
            router.push('/login');
        } else if (isRegistering && isAuthenticate) {
            setIsLoading(false);
        } else if (isRegistering && !isAuthenticate) {
            router.push('/register');
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
            <SEO pageTitle="Register" />
            <Header style_2={true} />
            <CommonBreadcrumb title="Register" subtitle="Register" center={true} />
            <RegisterAddressArea />
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default RegisterAddressPage;
