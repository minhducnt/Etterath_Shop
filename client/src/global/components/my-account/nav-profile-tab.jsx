import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { Box, DeliveryTwo, Processing, Truck } from '@svgs';
import { userLoggedOut } from '@/redux/features/auth/authSlice';
import { notifySuccess } from '@/global/utils/toastify';

const NavProfileTab = ({ orderData }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    // filter order data
    const order = orderData?.reduce(
        (acc, item) => {
            acc.totalDoc += 1;
            if (item.order_status === 'payment pending') acc.pending += 1;
            if (item.order_status === 'order placed') acc.processing += 1;
            if (item.order_status === 'order delivered') acc.delivered += 1;
            return acc;
        },
        { totalDoc: 0, pending: 0, processing: 0, delivered: 0 }
    );

    // handle logout
    const handleLogout = () => {
        dispatch(userLoggedOut());

        notifySuccess('Logout successfully');
        setTimeout(() => {
            router.push('/');
        }, 500);
    };

    return (
        <div className="profile__main">
            <div className="profile__main-top pb-60">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="profile__main-inner d-flex flex-wrap align-items-center">
                            <div className="profile__main-content">
                                <h4 className="profile__main-title" style={{ fontSize: '20px' }}>
                                    Welcome {user?.first_name} {user?.last_name}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="profile__main-logout text-sm-end">
                            <a onClick={handleLogout} className="cursor-pointer tp-logout-btn" style={{ textDecoration: 'none' }}>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile__main-info">
                <div className="row gx-3">
                    <div className="col-md-3 col-sm-6">
                        <div className="profile__main-info-item">
                            <div className="profile__main-info-icon">
                                <span>
                                    <span className="profile-icon-count profile-download">{order?.totalDoc ?? 0}</span>
                                    <Box />
                                </span>
                            </div>
                            <h4 className="profile__main-info-title">Total Order</h4>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <div className="profile__main-info-item">
                            <div className="profile__main-info-icon">
                                <span>
                                    <span className="profile-icon-count profile-order">{order?.pending ?? 0}</span>
                                    <Processing />
                                </span>
                            </div>
                            <h4 className="profile__main-info-title">Pending Order</h4>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <div className="profile__main-info-item">
                            <div className="profile__main-info-icon">
                                <span>
                                    <span className="profile-icon-count profile-wishlist">{order?.processing ?? 0}</span>
                                    <Truck />
                                </span>
                            </div>
                            <h4 className="profile__main-info-title">Processing Order</h4>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <div className="profile__main-info-item">
                            <div className="profile__main-info-icon">
                                <span>
                                    <span className="profile-icon-count profile-wishlist">{order?.delivered ?? 0}</span>
                                    <DeliveryTwo />
                                </span>
                            </div>
                            <h4 className="profile__main-info-title">Complete Order</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavProfileTab;
