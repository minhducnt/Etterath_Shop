import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// internal
import ErrorMsg from '../common/error-msg';
import { useUpdateProfileMutation, useGetUserQuery } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/global/utils/toastify';
import { DateHelper } from '@/global/utils/helpers/date';
import { CloseEye, OpenEye } from '@svgs';
import { useDispatch } from 'react-redux';

// schema
const schema = Yup.object().shape({
    password: Yup.string().required('Current password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

// schemaTwo
const schemaTwo = Yup.object().shape({
    newPassword: Yup.string().required().min(6).label('New Password'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { data } = useGetUserQuery();
    const user = data?.data[0];

    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [changePassword, {}] = useUpdateProfileMutation();

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(user?.googleSignIn ? schemaTwo : schema)
    });

    // on submit
    const onSubmit = data => {
        changePassword({
            user_name: user?.user_name,
            first_name: user?.first_name,
            last_name: user?.last_name,
            day_of_birth: DateHelper.convertToISOString(user?.day_of_birth),
            email: user?.email,
            phone: user?.phone,
            password: data.newPassword,
            confirm_password: data.confirmPassword
        }).then(result => {
            if (!result?.data) {
                const errorMessage = Object.values(result?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage ?? ''));
            } else {
                notifySuccess(result?.data?.message);
                setTimeout(() => {
                    dispatch(userLoggedOut());
                    notifySuccess('Logout successfully');
                    router.push('/');
                }, 500);
            }
        });
        reset();
    };

    return (
        <div className="profile__password">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    {!user?.googleSignIn && (
                        <div className="col-xxl-12">
                            <div className="tp-profile-input-box">
                                <div className="tp-contact-input">
                                    <input
                                        {...register('password', {
                                            required: `Password is required!`
                                        })}
                                        name="password"
                                        id="password"
                                        type={showOldPass ? 'text' : 'password'}
                                    />
                                </div>
                                <div className="tp-login-input-eye" id="password-show-toggle">
                                    <span className="open-eye" onClick={() => setShowOldPass(!showOldPass)}>
                                        {!showOldPass ? <CloseEye /> : <OpenEye />}
                                    </span>
                                </div>
                                <div className="tp-profile-input-title">
                                    <label htmlFor="newPassword">
                                        New Password <span style={{ color: 'red' }}>*</span>
                                    </label>
                                </div>
                                <ErrorMsg msg={errors.password?.message} />
                            </div>
                        </div>
                    )}

                    <div className="col-xxl-6 col-md-6">
                        <div className="tp-profile-input-box">
                            <div className="tp-profile-input">
                                <input
                                    {...register('newPassword', {
                                        required: `New Password is required!`
                                    })}
                                    name="newPassword"
                                    id="newPassword"
                                    type={showNewPass ? 'text' : 'password'}
                                />
                            </div>
                            <div className="tp-login-input-eye" id="password-show-toggle">
                                <span className="open-eye" onClick={() => setShowNewPass(!showNewPass)}>
                                    {!showNewPass ? <CloseEye /> : <OpenEye />}
                                </span>
                            </div>
                            <div className="tp-profile-input-title">
                                <label htmlFor="newPassword">
                                    New Password <span style={{ color: 'red' }}>*</span>
                                </label>
                            </div>
                            <ErrorMsg msg={errors.newPassword?.message} />
                        </div>
                    </div>

                    <div className="col-xxl-6 col-md-6">
                        <div className="tp-profile-input-box">
                            <div className="tp-profile-input">
                                <input
                                    {...register('confirmPassword')}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    type={showConfirmPass ? 'text' : 'password'}
                                />
                            </div>
                            <div className="tp-login-input-eye" id="password-show-toggle">
                                <span className="open-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                    {!showConfirmPass ? <CloseEye /> : <OpenEye />}
                                </span>
                            </div>
                            <div className="tp-profile-input-title">
                                <label htmlFor="confirmPassword">
                                    Confirm Password <span style={{ color: 'red' }}>*</span>
                                </label>
                            </div>
                            <ErrorMsg msg={errors.confirmPassword?.message} />
                        </div>
                    </div>

                    <div className="col-xxl-6 col-md-6">
                        <div className="profile__btn">
                            <button type="submit" className="tp-btn">
                                Change password
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
