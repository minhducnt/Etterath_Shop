import React from 'react';
import Link from 'next/link';
// internal
import LoginShapes from './login-shapes';
import AddressForm from '../forms/address-form';

const RegisterAddressArea = () => {
    return (
        <>
            <section className="tp-login-area pb-120 p-relative z-index-1 fix">
                <LoginShapes />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8">
                            <div className="tp-login-wrapper">
                                <div className="tp-login-top text-center">
                                    <h3 className="tp-login-title mb-3">Address</h3>
                                </div>

                                <div className="tp-login-option">
                                    <div className="tp-login-mail text-center mb-40">
                                        <p>Please register your address to continue </p>
                                    </div>

                                    <AddressForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterAddressArea;
