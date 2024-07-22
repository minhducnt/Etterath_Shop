import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
// internal
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import { emailRegex, phoneRegex, usernameRegex } from '@/global/utils/validators/validator';
import { notifyError, notifySuccess } from '@/global/utils/toastify';
import { Helper } from '@/global/utils/helpers/misc';
import ErrorMsg from '@/global/components/common/error-msg';
import { CloseEye, OpenEye } from '@svgs';

const LoginForm = () => {
    const router = useRouter();
    const { redirect } = router.query;

    const [showPass, setShowPass] = useState(false);
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
                username: Yup.string()
                    .required('Username is required')
                    .test('username', 'Invalid username, email or phone number', function (value) {
                        const isValidPhone = phoneRegex.test(value);
                        const isValidEmail = emailRegex.test(value);
                        const isValidUsername = usernameRegex.test(value);
                        return (
                            isValidEmail ||
                            isValidUsername ||
                            isValidPhone ||
                            new Yup.ValidationError('Invalid username, or email', value, 'username')
                        );
                    }),
                password: Yup.string().required('Password is required').min(5, 'Password is too short').max(30, 'Password is too long')
            })
        )
    });

    // onSubmit
    const onSubmit = data => {
        const { username, password } = data;

        let key = 'user_name';
        if (phoneRegex.test(username)) key = 'phone';
        else if (emailRegex.test(username)) key = 'email';

        const payload = {
            [key]: username,
            password
        };
        0;

        loginUser(payload).then(async data => {
            if (data?.data) {
                notifySuccess(data.data.message);
                await new Promise(r => setTimeout(r, 500));
                router.back();
            } else {
                const errorMessage = Object.values(data?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage ?? ''));
            }
        });

        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tp-login-input-wrapper">
                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('username', { required: `Username/Email/Phone is required!` })}
                            name="username"
                            id="username"
                            type="text"
                        />
                    </div>
                    <div className="tp-login-input-title">
                        <label htmlFor="username">
                            Username/Email/Phone <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.email?.message} />
                </div>

                <div className="tp-login-input-box">
                    <div className="p-relative">
                        <div className="tp-login-input">
                            <input
                                {...register('password', { required: `Password is required!` })}
                                id="password"
                                type={showPass ? 'text' : 'password'}
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
            </div>

            <div className="tp-login-bottom pt-20">
                <button type="submit" className="tp-login-btn w-100">
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
