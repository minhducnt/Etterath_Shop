import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
// internal
import { useCreateUserAddressMutation } from '@/redux/features/auth/authApi';
import { phoneRegex, pincodeRegex } from '@/global/utils/validators/validator';
import { notifyError, notifySuccess } from '@/global/utils/toastify';
import { Helper } from '@/global/utils/helpers/misc';

import ErrorMsg from '@/global/components/common/error-msg';
import Cookies from 'js-cookie';

const AddressForm = () => {
    const router = useRouter();

    const [createAddress, {}] = useCreateUserAddressMutation();

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(
            Yup.object().shape({
                name: Yup.string()
                    .required('Name is required')
                    .min(2, 'Name must be at least 2 characters')
                    .max(50, 'Name cannot be more than 50 characters'),
                phone_number: Yup.string()
                    .required('Phone number is required')
                    .matches(phoneRegex, 'Phone number must be exactly 10 digits'),
                detail_address: Yup.string().required('Detail address is required'),
                district: Yup.string().required('District is required'),
                pincode: Yup.string().required('Pincode is required').matches(pincodeRegex, 'Pincode must be exactly 6 digits')
            })
        )
    });

    // on submit
    const onSubmit = data => {
        createAddress({
            name: data.name,
            phone_number: data.phone_number,
            detail_address: data.detail_address,
            commune: data.commune,
            district: data.district,
            province: data.province,
            pincode: parseInt(data.pincode),
            country_id: 1,
            is_default: true
        }).then(async data => {
            if (!data?.data) {
                const errorMessage = Object.values(data?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage ?? ''));
                return;
            }

            notifySuccess(data?.data?.message);
            Cookies.remove('isRegistering');
            await new Promise(r => setTimeout(r, 500));
            router.push('/');
        });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tp-login-input-wrapper">
                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('name', { required: `Address name is required!` })}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Home, Office, etc"
                        />
                    </div>

                    <div className="tp-login-input-title">
                        <label htmlFor="name">
                            Address Name <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.name?.message} />
                </div>

                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('detail_address', { required: `Username is required!` })}
                            id="detail_address"
                            name="detail_address"
                            type="text"
                            placeholder="1 Vo Van Ngan, Linh Chieu Ward, Thu Duc City, Ho Chi Minh City...."
                        />
                    </div>

                    <div className="tp-login-input-title">
                        <label htmlFor="name">
                            Details <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.detail_address?.message} />
                </div>

                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('phone_number', { required: `Phone number is required!` })}
                            id="phone_number"
                            name="phone_number"
                            type="text"
                            placeholder="0123456789"
                        />
                    </div>
                    <div className="tp-login-input-title">
                        <label htmlFor="name">
                            Phone number <span style={{ color: 'red' }}>*</span>
                        </label>
                    </div>
                    <ErrorMsg msg={errors.phone_number?.message} />
                </div>

                <div className="tp-login-input-box">
                    <div className="tp-login-input">
                        <input
                            {...register('country_id')}
                            id="country_id"
                            name="country_id"
                            type="text"
                            defaultValue={`Vietnam`}
                            readOnly
                            style={{ backgroundColor: '#f9f9f9' }}
                        />
                    </div>
                    <div className="tp-login-input-title">
                        <label htmlFor="country_id">Country</label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="tp-login-input-box" style={{ flex: 1, marginRight: '24px' }}>
                        <div className="tp-login-input">
                            <input
                                {...register('district', { required: `District is required!` })}
                                id="district"
                                name="district"
                                type="text"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="tp-login-input-title">
                            <label htmlFor="district">
                                District <span style={{ color: 'red' }}>*</span>
                            </label>
                        </div>
                        <ErrorMsg msg={errors.district?.message} />
                    </div>

                    <div className="tp-login-input-box" style={{ flex: 1 }}>
                        <div className="tp-login-input">
                            <input
                                {...register('pincode', { required: `Pincode is required!` })}
                                id="pincode"
                                name="pincode"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="tp-login-input-title">
                            <label htmlFor="pincode">
                                Pincode <span style={{ color: 'red' }}>*</span>
                            </label>
                        </div>
                        <ErrorMsg msg={errors.pincode?.message} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="tp-login-input-box" style={{ flex: 1, marginRight: '24px' }}>
                        <div className="tp-login-input">
                            <input
                                {...register('commune', { required: `Commune is required!` })}
                                id="commune"
                                name="commune"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="tp-login-input-title">
                            <label htmlFor="commune">Commune</label>
                        </div>
                        <ErrorMsg msg={errors.commune?.message} />
                    </div>

                    <div className="tp-login-input-box" style={{ flex: 1 }}>
                        <div className="tp-login-input">
                            <input
                                {...register('province', { required: `Province is required!` })}
                                id="province"
                                name="province"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="tp-login-input-title">
                            <label htmlFor="province">Province</label>
                        </div>
                        <ErrorMsg msg={errors.province?.message} />
                    </div>
                </div>
            </div>

            <div className="tp-login-bottom pt-20">
                <button type="submit" className="tp-login-btn w-100">
                    Confirm
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
