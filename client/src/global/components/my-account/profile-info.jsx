import { useUpdateProfileMutation, useGetUserQuery } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/global/utils/toastify';
import { DateHelper } from '@/global/utils/helpers/date';

import { yupResolver } from '@hookform/resolvers/yup';

import { EmailTwo, PhoneThree, UserThree } from '@svgs';

import React from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import ErrorMsg from '../common/error-msg';

const ProfileInfo = () => {
    const { data } = useGetUserQuery();
    const user = data?.data[0];

    const [updateProfile, {}] = useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(
            Yup.object().shape({
                user_name: Yup.string().required().label('Name'),
                email: Yup.string().email('Invalid email format').required('This field is required'),
                phone: Yup.string().required().min(10).label('Phone'),
                first_name: Yup.string().required().label('First name'),
                last_name: Yup.string().required().label('Last name')
            })
        ),
        defaultValues: {
            user_name: user?.user_name || '',
            day_of_birth: user?.day_of_birth || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || ''
        }
    });

    // on submit
    const onSubmit = data => {
        setIsEditing(false);

        updateProfile({
            id: user?.id,
            user_name: data.user_name,
            day_of_birth: DateHelper.convertToISOString(data.day_of_birth),
            first_name: data.first_name,
            last_name: data.last_name,
            name: data.name,
            email: user?.email,
            phone: user?.phone
        }).then(result => {
            if (!result?.data) {
                const errorMessage = Object.values(result?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage ?? ''));
            } else {
                notifySuccess(result?.data?.message);
            }
        });
    };

    return (
        <div className="profile__info">
            <h3 className="profile__info-title">Personal Details</h3>
            <div className="profile__info-content">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('user_name', { required: `User name is required!` })}
                                        name="user_name"
                                        type="text"
                                        placeholder="Enter your user_name"
                                        defaultValue={user?.user_name}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <div className="tp-login-input-title">
                                        <label htmlFor="user_name" style={{ backgroundColor: 'transparent' }}>
                                            Username
                                        </label>
                                    </div>
                                    <span>
                                        <UserThree />
                                    </span>
                                    <ErrorMsg msg={errors.user_name?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('phone', { required: true })}
                                        name="phone"
                                        type="text"
                                        placeholder="Enter your number"
                                        defaultValue={user?.phone}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <div className="tp-login-input-title">
                                        <label htmlFor="username" style={{ backgroundColor: 'transparent' }}>
                                            Email
                                        </label>
                                    </div>
                                    <span>
                                        <PhoneThree />
                                    </span>
                                    <ErrorMsg msg={errors.phone?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('email', { required: `Email is required!` })}
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        defaultValue={user?.email}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <div className="tp-login-input-title">
                                        <label htmlFor="email" style={{ backgroundColor: 'transparent' }}>
                                            Phone
                                        </label>
                                    </div>
                                    <span>
                                        <EmailTwo />
                                    </span>
                                    <ErrorMsg msg={errors.email?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('first_name', { required: `First name is required!` })}
                                        name="first_name"
                                        type="text"
                                        placeholder="Enter your first name"
                                        defaultValue={user?.first_name}
                                    />
                                    <div className="tp-login-input-title">
                                        <label htmlFor="username">First name</label>
                                    </div>
                                    <span>
                                        <UserThree />
                                    </span>
                                    <ErrorMsg msg={errors.first_name?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('last_name', { required: `Last name is required!` })}
                                        name="last_name"
                                        type="text"
                                        placeholder="Enter your last name"
                                        defaultValue={user?.last_name}
                                    />
                                    <div className="tp-login-input-title">
                                        <label htmlFor="username">Last name</label>
                                    </div>
                                    <span>
                                        <UserThree />
                                    </span>
                                    <ErrorMsg msg={errors.last_name?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-12">
                            <div className="profile__btn">
                                <button type="submit" className="tp-btn">
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileInfo;
