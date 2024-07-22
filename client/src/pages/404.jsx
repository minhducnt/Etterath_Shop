import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import SEO from '@/global/components/seo';
import Header from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';

import Error from '@assets/img/error/error.png';

const ErrorPage = () => {
    return (
        <Wrapper>
            <SEO pageTitle="404" />
            <Header style_2={true} />

            <section className="tp-error-area pt-150 pb-150">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8 col-md-10">
                            <div className="tp-error-content text-center">
                                <div className="tp-error-thumb">
                                    <Image src={Error} alt="error img" height={200} />
                                </div>

                                <h3 className="tp-error-title">Oops! Page not found</h3>
                                <p>Whoops, this is embarrassing. Looks like the page you were looking for was not found.</p>

                                <Link href="/" className="tp-error-btn" style={{ textDecoration: 'none' }}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default ErrorPage;
