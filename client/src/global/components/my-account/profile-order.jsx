import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';
// internal
import { Helper } from '@/global/utils/helpers/misc';
import { useUpdateOrderStatusMutation } from '@/redux/features/order/orderApi';
import { notifyError, notifySuccess } from '@/global/utils/toastify';

const MyOrders = ({ orderData }) => {
    const order_items = orderData;
    null;

    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    function getStatusClass(orderStatus) {
        switch (orderStatus) {
            case 'payment pending':
                return 'status pending';
            case 'order placed':
                return 'status hold';
            case 'order delivered':
                return 'status done';
            default:
                return '';
        }
    }

    const handleConfirmOrder = shop_order_id => {
        updateOrderStatus({ shop_order_id }).then(result => {
            if (!result?.data) {
                const errorMessage = Object.values(result?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage ?? ''));
            } else {
                notifySuccess(result?.data?.message);
            }
        });
    };

    return (
        <div className="profile__ticket table-responsive">
            {!order_items ||
                (order_items?.length === 0 && (
                    <div
                        style={{ height: '194px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        className="d-flex align-items-center justify-content-center"
                    >
                        <div className="text-center">
                            <i style={{ fontSize: '30px' }} className="fa-solid fa-cart-circle-xmark"></i>
                            <p>You don't have any orders!</p>
                        </div>
                    </div>
                ))}

            {order_items && order_items?.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Order Time</th>
                            <th scope="col">Status</th>
                            <th scope="col">Total</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order_items.map((item, i) => (
                            <tr key={i}>
                                <th scope="row">#{item.shop_order_id}</th>
                                <td data-info="title">{dayjs(item.order_date).format('MMMM D, YYYY')}</td>
                                <td data-info={`${getStatusClass(item.order_status)}`} className={`${getStatusClass(item.order_status)}`}>
                                    {Helper.toTitleCase(item.order_status)}
                                </td>
                                <td data-info="price">{Helper.formatCurrency(item.order_total_price)}</td>
                                <td>
                                    <Link
                                        href={`/order/${item.shop_order_id}`}
                                        className="tp-logout-btn"
                                        style={{ textDecoration: 'none', marginRight: '8px' }}
                                    >
                                        <i className="fa-regular fa-file-invoice"></i>
                                    </Link>

                                    <button
                                        className="tp-logout-btn"
                                        onClick={() => handleConfirmOrder(item.shop_order_id)}
                                        style={{
                                            textDecoration: 'none',
                                            marginRight: '8px',
                                            backgroundColor: item.order_status === 'order delivered' ? '#ccc' : '#007bff',
                                            color: item.order_status === 'order delivered' ? '#000' : '#fff',
                                            pointerEvents: item.order_status === 'order delivered' ? 'none' : 'auto'
                                        }}
                                        disabled={item.order_status === 'order delivered'}
                                    >
                                        Confirm
                                    </button>

                                    <Link
                                        href={`/order-review/${item.shop_order_id}`}
                                        className="tp-logout-btn"
                                        style={{
                                            textDecoration: 'none',
                                            backgroundColor: item.order_status !== 'order delivered' ? '#ccc' : 'white',
                                            color: item.order_status !== 'order delivered' ? '#000' : '#000',
                                            pointerEvents: item.order_status !== 'order delivered' ? 'none' : 'auto'
                                        }}
                                    >
                                        <i className="fa-regular fa-thumbs-up"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyOrders;
