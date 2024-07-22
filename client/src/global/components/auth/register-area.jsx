import React from 'react';
import Link from 'next/link';
// internal
import LoginShapes from './login-shapes';
import RegisterForm from '../forms/register-form';

const RegisterArea = () => {
    return (
        <>
            <section className="tp-login-area pt-4 pb-120 p-relative z-index-1 fix">
                <LoginShapes />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8">
                            <div className="tp-login-wrapper">
                                <div className="tp-login-top text-center mb-30">
                                    <h3 className="tp-login-title mb-3">Sign Up to Etterath.</h3>
                                    <p>
                                        Already have an account?{' '}
                                        <span>
                                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                                Sign In
                                            </Link>
                                        </span>
                                    </p>
                                </div>

                                <div className="tp-login-option">
                                    <div className="tp-login-mail text-center mb-40">
                                        <p>
                                            Sign up with{' '}
                                            <a href="#" style={{ textDecoration: 'none' }}>
                                                Email
                                            </a>
                                        </p>
                                    </div>

                                    <RegisterForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterArea;
