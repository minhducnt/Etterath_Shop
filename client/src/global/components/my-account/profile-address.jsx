import React, { useState, useEffect, useCallback, use } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// internal
import { useGetUserAddressQuery, useCreateUserAddressMutation, useUpdateUserAddressMutation } from '@/redux/features/auth/authApi';
import { phoneRegex, pincodeRegex } from '@/global/utils/validators/validator';
import ErrorMsg from '../common/error-msg';
import { notifyError, notifySuccess } from '@/global/utils/toastify';

const ProfileAddress = () => {
    const [editedData, setEditedData] = useState({});
    const [showAddressForm, setShowAddressForm] = useState(false);

    const [userAddresses, setUserAddresses] = useState([[]]);

    const { data: listAddresData, refetch } = useGetUserAddressQuery();

    const [createAddress, {}] = useCreateUserAddressMutation();
    const [updateAddress, {}] = useUpdateUserAddressMutation();

    useEffect(() => {
        const address = listAddresData?.data?.flat().filter(Boolean) ?? [];
        setUserAddresses(address.length > 0 ? address : undefined);
    }, [listAddresData]);

    const {
        register,
        handleSubmit,
        setValue,
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
        ),
        defaultValues: {
            name: editedData?.name || '',
            phone_number: editedData?.phone_number || '',
            detail_address: editedData?.detail_address || '',
            commune: editedData?.commune || '',
            district: editedData?.district || '',
            province: editedData?.province || '',
            phone: editedData?.phone || ''
        }
    });

    const onSubmit = useCallback(
        data => {
            const submitData = {
                ...data,
                pincode: parseInt(data.pincode),
                country_id: 1
            };

            if (editedData?.address_id) {
                updateAddress(submitData)
                    .then(() => {
                        notifySuccess('Address updated successfully');
                    })
                    .catch(error => {
                        notifyError('Failed to update address');
                    });
            } else {
                createAddress(submitData)
                    .then(() => {
                        notifySuccess('Address created successfully');
                    })
                    .catch(error => {
                        notifyError('Failed to create address');
                    });
            }

            refetch();
            setShowAddressForm(false);
            reset();
        },
        [createAddress, updateAddress, editedData]
    );

    const handleAddAddress = useCallback(() => {
        setEditedData({});
        setShowAddressForm(!showAddressForm);
        reset();
    }, [showAddressForm, setShowAddressForm, reset]);

    const handleEditAddress = useCallback(address => {
        setEditedData(address);
        setShowAddressForm(true);
    }, []);

    useEffect(() => {
        if (editedData) {
            Object.keys(editedData).forEach(key => {
                setValue(key, editedData[key]);
            });
        }
    }, [editedData, setValue]);

    const handleCancel = () => {
        setEditedData({});
        setShowAddressForm(false);
    };

    return (
        <div className="profile__info">
            <div className="profile__main-top pb-30">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="profile__main-inner d-flex flex-wrap align-items-center">
                            <div className="profile__main-content">
                                <h4 className="profile__main-title" style={{ fontSize: '20px' }}>
                                    My Address
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="profile__main-logout text-sm-end">
                            {showAddressForm ? (
                                <div>
                                    <a
                                        className="cursor-pointer tp-logout-btn"
                                        style={{ textDecoration: 'none', flex: 1, marginRight: '8px' }}
                                        onClick={handleSubmit(onSubmit)}
                                        type="submit"
                                    >
                                        Save
                                    </a>
                                    <a className="cursor-pointer tp-logout-btn" style={{ textDecoration: 'none' }} onClick={handleCancel}>
                                        Back
                                    </a>
                                </div>
                            ) : (
                                <a className="cursor-pointer tp-logout-btn" style={{ textDecoration: 'none' }} onClick={handleAddAddress}>
                                    Add Address
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAddressForm && editedData ? (
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
                                <input type="text" defaultValue={`Vietnam`} readOnly style={{ backgroundColor: '#f9f9f9' }} />
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
                                        placeholder=""
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

                        <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between">
                            <div className="tp-login-remeber">
                                <input
                                    {...register('is_default', {
                                        required: `Terms and Conditions is required!`
                                    })}
                                    id="is_default"
                                    name="is_default"
                                    type="checkbox"
                                />
                                <label htmlFor="is_default">Is default</label>
                                <ErrorMsg msg={errors.is_default?.message} />
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="profile__ticket table-responsive">
                    {!userAddresses ||
                        (userAddresses?.length === 0 && (
                            <div style={{ height: '210px' }} className="d-flex align-items-center justify-content-center">
                                <div className="text-center">
                                    <i style={{ fontSize: '30px' }} className="fa-solid fa-cart-circle-xmark"></i>
                                    <p>You don't have any orders!</p>
                                </div>
                            </div>
                        ))}

                    {userAddresses && userAddresses?.length > 0 && (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Action</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Detail</th>
                                    <th scope="col">Commune</th>
                                    <th scope="col">District</th>
                                    <th scope="col">Province</th>
                                    <th scope="col">Pincode</th>
                                    <th scope="col">Country</th>
                                    <th scope="col">Default</th>
                                </tr>
                            </thead>

                            <tbody>
                                {userAddresses.map((item, i) => (
                                    <tr key={i}>
                                        <td data-info="row" style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn btn-secondary"
                                                type="button"
                                                id="editButton"
                                                style={{ width: '40px' }}
                                                onClick={() => handleEditAddress(item)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </td>
                                        <td data-info="row">{item.name}</td>
                                        <td data-info="row">{item.phone_number}</td>
                                        <td data-info="row">{item.detail_address}</td>
                                        <td data-info="row">{item.commune}</td>
                                        <td data-info="row">{item.district}</td>
                                        <td data-info="row">{item.province}</td>
                                        <td data-info="row">{item.pincode}</td>
                                        <td data-info="row">{item.country_name}</td>
                                        <td data-info="row" style={{ textAlign: 'center' }}>
                                            {item.is_default ? (
                                                <i className="fas fa-check-circle" style={{ color: 'green' }}></i>
                                            ) : (
                                                <i className="fas fa-times-circle" style={{ color: 'red' }}></i>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileAddress;
