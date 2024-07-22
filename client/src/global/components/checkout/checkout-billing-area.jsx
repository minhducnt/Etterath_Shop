import ErrorMsg from '../common/error-msg';
import NiceSelect from '@/global/utils/ui/nice-select';
import React, { useState, useEffect } from 'react';
import { DateHelper } from '@/global/utils/helpers/date';
import { EmailTwo, Date, PhoneThree, UserThree, LocationTwo } from '@svgs';

import { useGetUserAddressQuery } from '@/redux/features/auth/authApi';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const CheckoutBillingArea = ({ register, errors }) => {
    const [selectedAddress, setSelectedAddress] = useState('');
    const [defaultAddress, setDefaultAddress] = useState({});
    const [userAddresses, setUserAddresses] = useState([[]]);
    const { data: listUserAddresses, isError, isLoading } = useGetUserAddressQuery();

    let content = null;

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    useEffect(() => {
        if (listUserAddresses && Array.isArray(listUserAddresses.data)) {
            const userAddress = listUserAddresses?.data?.flat() ?? [];
            userAddress.length > 0 && userAddress[0] !== null ? setUserAddresses(userAddress) : setUserAddresses();

            if (userAddress.length > 0) {
                const defaultAddress = userAddress.find(item => item.is_default === true);
                Cookies.set('defaultAddress', JSON.stringify(defaultAddress));
                setDefaultAddress(defaultAddress);
            }
        } else {
            setUserAddresses();
        }
    }, [listUserAddresses, defaultAddress]);

    useEffect(() => {
        if (userAddresses && userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0].id);
        }
    }, [userAddresses]);

    const selectHandleFilter = selectedOption => {
        setSelectedAddress(selectedOption.value);
    };

    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong" />;
    }

    return (
        <div className="tp-checkout-bill-area">
            <h3 className="tp-checkout-bill-title">Billing Details</h3>

            <div className="tp-checkout-bill-form">
                <div className="tp-checkout-bill-inner">
                    <div className="row">
                        {/* User Info */}
                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('first_name')}
                                        name="first_name"
                                        type="text"
                                        placeholder="Enter your first name"
                                        defaultValue={user?.first_name}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
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
                                        {...register('last_name')}
                                        name="last_name"
                                        type="text"
                                        placeholder="Enter your last name"
                                        defaultValue={user?.last_name}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <span>
                                        <UserThree />
                                    </span>
                                    <ErrorMsg msg={errors.last_name?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-12">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('phone')}
                                        name="phone"
                                        type="text"
                                        placeholder="Enter your number"
                                        defaultValue={user?.phone}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <span>
                                        <PhoneThree />
                                    </span>
                                    <ErrorMsg msg={errors.phone?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-12">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('email')}
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        defaultValue={user?.email}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <span>
                                        <EmailTwo />
                                    </span>
                                    <ErrorMsg msg={errors.email?.message} />
                                </div>
                            </div>
                        </div>

                        {/* Addredd */}
                        <h2 className="tp-checkout-bill-title">Address Details</h2>
                        <div className="col-xxl-12">
                            <div className="profile__input-box">
                                <div className="profile__input">
                                    <input
                                        {...register('detailAddress')}
                                        name="detailAddress"
                                        type="text"
                                        placeholder="Enter your detail address"
                                        defaultValue={defaultAddress?.detail_address}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <span>
                                        <LocationTwo />
                                    </span>
                                    <ErrorMsg msg={errors.detail_address?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-4 col-md-4">
                            <div className="profile__input-box">
                                <div className="tp-profile-input-box">
                                    <input
                                        {...register('commune')}
                                        name="commune"
                                        type="text"
                                        placeholder="Enter your commune"
                                        defaultValue={defaultAddress?.commune}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <ErrorMsg msg={errors.commune?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-4 col-md-4">
                            <div className="profile__input-box">
                                <div className="tp-profile-input-box">
                                    <input
                                        {...register('district')}
                                        name="district"
                                        type="text"
                                        placeholder="Enter your district"
                                        defaultValue={defaultAddress?.district}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <ErrorMsg msg={errors.district?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-4 col-md-4">
                            <div className="profile__input-box">
                                <div className="tp-profile-input-box">
                                    <input
                                        {...register('province')}
                                        name="province"
                                        type="text"
                                        placeholder="Enter your province"
                                        defaultValue={defaultAddress?.province}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <ErrorMsg msg={errors.province?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="tp-profile-input-box">
                                    <input
                                        {...register('postal code')}
                                        name="postal code"
                                        type="text"
                                        placeholder="Enter your postal code"
                                        defaultValue={defaultAddress?.pincode}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <ErrorMsg msg={errors.pincode?.message} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-6 col-md-6">
                            <div className="profile__input-box">
                                <div className="tp-profile-input-box">
                                    <input
                                        {...register('country_name')}
                                        name="country_name"
                                        type="text"
                                        placeholder="Enter your country_name"
                                        defaultValue={defaultAddress?.country_name}
                                        readOnly
                                        style={{ backgroundColor: '#f9f9f9' }}
                                    />
                                    <ErrorMsg msg={errors.country_name?.message} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutBillingArea;
