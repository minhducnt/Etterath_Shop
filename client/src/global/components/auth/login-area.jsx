import React from 'react';
import Link from 'next/link';
// internal
import LoginForm from '../forms/login-form';
import LoginShapes from './login-shapes';

const LoginArea = () => {
    return (
        <>
            <section className="tp-login-area pt-4 pb-120 p-relative z-index-1 fix">
                <LoginShapes />

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8">
                            <div className="tp-login-wrapper">
                                <div className="tp-login-top text-center mb-30">
                                    <h3 className="tp-login-title mb-3">Login to Etterath.</h3>

                                    <p>
                                        Don’t have an account?
                                        <span>
                                            <Link href="/register" style={{ textDecoration: 'none', margin: '0 8px' }}>
                                                Create an account
                                            </Link>
                                        </span>
                                    </p>
                                </div>

                                <div className="tp-login-option">
                                    <div className="tp-login-mail text-center mb-40">
                                        <p>
                                            Sign in with{' '}
                                            <a href="#" style={{ textDecoration: 'none' }}>
                                                Email
                                            </a>
                                        </p>
                                    </div>

                                    <LoginForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginArea;
