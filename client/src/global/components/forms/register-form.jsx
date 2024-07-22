import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// internal
import { useRegisterUserMutation, useLoginUserMutation } from '@/redux/features/auth/authApi';
import { phoneRegex } from '@/global/utils/validators/validator';
import { notifyError, notifySuccess } from '@/global/utils/toastify';
import { Helper } from '@/global/utils/helpers/misc';

import ErrorMsg from '@/global/components/common/error-msg';
import { CloseEye, OpenEye } from '@svgs';

const RegisterForm = () => {
    const router = useRouter();

    const [showPass, setShowPass] = useState(false);
    const [registerUser, {}] = useRegisterUserMutation();
    const [loginUser, {}] = useLoginUserMutation();

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(
            Yup.object().shape({
                user_name: Yup.string('Please enter a valid username')
                    .min(0, 'Username is too short')
                    .max(15, 'Username is too long')
                    .required('User Name required'),
                email: Yup.string().email('Invalid Email').required('Email required'),
                phone: Yup.string()
                    .required('Phone is required')
                    .test('is-valid-phone', 'Phone number is not valid', value => phoneRegex.test(value)),
                password: Yup.string().required('Password is required').min(5, 'Password is too short').max(30, 'Password is too long'),
                confirm_password: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    .required('Confirm password is required'),
                remember: Yup.bool().oneOf([true], 'You must agree to the terms and conditions to proceed.').label('Terms and Conditions')
            })
        )
    });

    // on submit
    const onSubmit = data => {
        localStorage.setItem('user_name', data.user_name);
        localStorage.setItem('password', data.password);

        registerUser({
            user_name: data.user_name,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            confirm_password: data.confirm_password
        }).then(async data => {
            if (!data?.data) {
                const errorMessage = Object.values(data?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage));
                return;
            }

            notifySuccess(data?.data?.message);
            loginUser({
                user_name: localStorage.getItem('user_name'),
                password: localStorage.getItem('password')
            }).then(async data => {
                if (data?.data) {
                    localStorage.removeItem('user_name');
                    localStorage.removeItem('password');
                    Cookies.set('isRegistering', true);

                    await new Promise(r => setTimeout(r, 500));
                    router.push('/register-address');
                } else {
                    const errorMessage = Object.values(data?.error?.data?.error ?? {})[0];
                    notifyError(Helper.toSentenceCase(errorMessage ?? ''));
                }
            });
        });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tp-login-input-wrapper">
                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('user_name', { required: `Username is required!` })}
                            id="user_name"
                            name="user_name"
                            type="text"
                            placeholder="johndoe"
                        />
                    </div>

                    <div className="tp-login-input-title">
                        <label htmlFor="name">
                            Your Username <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.name?.message} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="tp-login-input-box" style={{ flex: 1, marginRight: '24px' }}>
                        <div className="tp-login-input">
                            <input
                                {...register('first_name', { required: `First Name is required!` })}
                                id="first_name"
                                name="first_name"
                                type="text"
                                placeholder="John"
                            />
                        </div>
                        <div className="tp-login-input-title">
                            <label htmlFor="first_name">
                                Your First Name <span style={{ color: 'red' }}>*</span>
                            </label>
                        </div>
                        <ErrorMsg msg={errors.first_name?.message} />
                    </div>

                    <div className="tp-login-input-box" style={{ flex: 1 }}>
                        <div className="tp-login-input">
                            <input
                                {...register('last_name', { required: `Last Name is required!` })}
                                id="last_name"
                                name="last_name"
                                type="text"
                                placeholder="Doe"
                            />
                        </div>
                        <div className="tp-login-input-title">
                            <label htmlFor="last_name">
                                Your Last Name <span style={{ color: 'red' }}>*</span>
                            </label>
                        </div>
                        <ErrorMsg msg={errors.last_name?.message} />
                    </div>
                </div>

                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('email', { required: `Email is required!` })}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="etterath@mail.com"
                        />
                    </div>
                    <div className="tp-login-input-title">
                        <label htmlFor="email">
                            Your Email <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.email?.message} />
                </div>

                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('phone', { required: `Phone is required!` })}
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder="0123456789"
                        />
                    </div>
                    <div className="tp-login-input-title">
                        <label htmlFor="name">
                            Your Phone <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.name?.message} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="tp-login-input-box" style={{ flex: 1, marginRight: '24px' }}>
                        <div className="p-relative">
                            <div className="tp-login-input">
                                <input
                                    {...register('password', { required: `Password is required!` })}
                                    id="password"
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min. 6 character"
                                />
                            </div>
                            <div className="tp-login-input-eye" id="password-show-toggle">
                                <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                                    {!showPass ? <CloseEye /> : <OpenEye />}
                                </span>
                            </div>
                            <div className="tp-login-input-title">
                                <label htmlFor="password">
                                    Password <span style={{ color: 'red' }}>*</span>
                                </label>
                            </div>
                        </div>
                        <ErrorMsg msg={errors.password?.message} />
                    </div>

                    <div className="tp-login-input-box" style={{ flex: 1 }}>
                        <div className="p-relative ">
                            <div className="tp-login-input">
                                <input
                                    {...register('confirm_password', { required: `Confirm Password is required!` })}
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min. 6 character"
                                />
                            </div>
                            <div className="tp-login-input-eye" id="confirm-password-show-toggle">
                                <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                                    {!showPass ? <CloseEye /> : <OpenEye />}
                                </span>
                            </div>
                            <div className="tp-login-input-title">
                                <label htmlFor="confirmPassword">
                                    Confirm Password <span style={{ color: 'red' }}>*</span>
                                </label>
                            </div>
                        </div>
                        <ErrorMsg msg={errors.confirm_password?.message} />
                    </div>
                </div>

                <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
                    <div className="tp-login-remeber">
                        <input
                            {...register('remember', {
                                required: `Terms and Conditions is required!`
                            })}
                            id="remember"
                            name="remember"
                            type="checkbox"
                        />
                        <label htmlFor="remember">
                            I accept the terms of the Service & <a href="#">Privacy Policy</a>.
                        </label>
                        <ErrorMsg msg={errors.remember?.message} />
                    </div>
                </div>
            </div>

            <div className="tp-login-bottom pt-20">
                <button type="submit" className="tp-login-btn w-100">
                    Sign Up
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
