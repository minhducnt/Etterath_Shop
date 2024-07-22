import React, { useEffect, useState } from 'react';
// internal
import { useGetUserOrdersQuery } from '@/redux/features/order/orderApi';

import ChangePassword from './profile-password';
import MyOrders from './profile-order';
import NavProfileTab from './nav-profile-tab';
import ProfileAddress from './profile-address';
import ProfileInfo from './profile-info';
import ProfileNavTab from './profile-nav-tab';
import ProfileShape from './profile-shape';

const ProfileArea = () => {
    const [orders, setOrders] = useState([[]]);
    const { data: ordersData } = useGetUserOrdersQuery();

    useEffect(() => {
        const orders = ordersData?.data?.flat().filter(Boolean) ?? [];
        setOrders(orders.length > 0 ? orders : []);
    }, [ordersData]);

    return (
        <>
            <section className="profile__area pt-120 pb-120 p-relative z-index-1 fix">
                <div className="container">
                    <div className="profile__inner p-relative">
                        <ProfileShape />

                        <div className="row">
                            <div className="col-xxl-4 col-lg-4">
                                <div className="profile__tab mr-40">
                                    <ProfileNavTab />
                                </div>
                            </div>

                            <div className="col-xxl-8 col-lg-8">
                                <div className="profile__tab-content">
                                    <div className="tab-content" id="profile-tabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="nav-profile"
                                            role="tabpanel"
                                            aria-labelledby="nav-profile-tab"
                                        >
                                            <NavProfileTab orderData={orders} />
                                        </div>

                                        <div
                                            className="tab-pane fade"
                                            id="nav-address"
                                            role="tabpanel"
                                            aria-labelledby="nav-information-tab"
                                        >
                                            <ProfileAddress />
                                        </div>

                                        <div
                                            className="tab-pane fade"
                                            id="nav-information"
                                            role="tabpanel"
                                            aria-labelledby="nav-information-tab"
                                        >
                                            <ProfileInfo />
                                        </div>

                                        <div className="tab-pane fade" id="nav-password" role="tabpanel" aria-labelledby="nav-password-tab">
                                            <ChangePassword />
                                        </div>

                                        <div className="tab-pane fade" id="nav-order" role="tabpanel" aria-labelledby="nav-order-tab">
                                            <MyOrders orderData={orders} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProfileArea;
