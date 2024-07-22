import React, { useEffect, useState } from 'react';
// internal
import SEO from '@/global/components/seo';
import Header from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';
import CommonBreadcrumb from '@/global/components/breadcrumb/common-breadcrumb';
import LoginArea from '@/global/components/auth/login-area';
import { useRouter } from 'next/router';
import Loader from '@/global/components/loader/loader';
import Cookies from 'js-cookie';

const LoginPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isAuthenticate = Cookies.get('userAuth');
        isAuthenticate ? router.push('/profile') : setIsLoading(false);
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
            <SEO pageTitle="Login" />
            <Header style_2={true} />
            <CommonBreadcrumb title="Login" subtitle="Login" center={true} />
            <LoginArea />
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default LoginPage;
