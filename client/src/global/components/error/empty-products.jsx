import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import Error from '@assets/img/error/error.png';

const EmptyProducts = () => {
    return (
        <section className="tp-error-area pt-150 pb-150">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-8 col-md-10">
                        <div className="tp-error-content text-center">
                            <div className="tp-error-thumb">
                                <Image src={Error} alt="error img" height={200} />
                            </div>

                            <h3 className="tp-error-title">Oops! No products found</h3>
                            <p>Whoops, this is embarrassing. Please try again.</p>

                            <Link href="/" className="tp-error-btn" style={{ textDecoration: 'none' }}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmptyProducts;
