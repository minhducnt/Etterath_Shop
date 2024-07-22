import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import ReactToPrint from 'react-to-print';
// internal
import SEO from '@/global/components/seo';
import Wrapper from '@/global/layout/wrapper';
import HeaderTwo from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';

import { useGetUserOrdersQuery, useGetUserOrderItemsByShopOrderIdQuery } from '@/redux/features/order/orderApi';

import PrdDetailsLoader from '@/global/components/loader/prd-details-loader';
import logo from '@assets/img/logo/logo.svg';
import ErrorMsg from '@/global/components/common/error-msg';

import { Helper } from '@/global/utils/helpers/misc';
import Cookies from 'js-cookie';
import { notifyError } from '@/global/utils/toastify';
import Loader from '@/global/components/loader/loader';
import { useSelector } from 'react-redux';

const SingleOrder = ({ params }) => {
    const orderId = parseInt(params.id);
    const router = useRouter();
    const printRef = useRef();
    const [isLoadingPage, setPageLoading] = useState(true);

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const [order, setOrder] = useState({});
    const [orders, setOrders] = useState([[]]);
    const [orderItems, setOrderItems] = useState([[]]);

    const { data: ordersData, isError, isLoading } = useGetUserOrdersQuery();
    const { data: orderItemsData } = useGetUserOrderItemsByShopOrderIdQuery(orderId);

    useEffect(() => {
        const orders = ordersData?.data?.flat().filter(Boolean) ?? [];
        setOrders(orders.length > 0 ? orders : []);

        const orderItems = orderItemsData?.data?.flat().filter(Boolean) ?? [];
        setOrderItems(orderItems.length > 0 ? orderItems : []);
    }, [ordersData, orderItemsData]);

    useEffect(() => {
        if (!orders) return;
        if (orders.length > 0) {
            const order = orders.find(order => order.shop_order_id === orderId);
            if (order) {
                setOrder({ order });
            }
        }
    }, [orders, orderId]);

    useEffect(() => {
        const isAuthenticate = Cookies.get('userAuth');
        if (!isAuthenticate) {
            notifyError('You need to login first');
            router.push('/login');
        } else {
            setPageLoading(false);
        }
    }, [router]);

    let content = null;

    if (isLoadingPage) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <Loader spinner="fade" loading={isLoading} />
            </div>
        );
    }

    if (isLoading) {
        content = <PrdDetailsLoader loading={isLoading} />;
    }

    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong! Please try again!" />;
    }

    if (!isLoading && !isError) {
        const { shop_order_id, order_date, address, order_total_price, discount, payment_method_name } = order.order || {};
        content = (
            <>
                <section className="invoice__area pt-120 pb-120">
                    <div className="container">
                        <div className="invoice__msg-wrapper">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="invoice_msg mb-40">
                                        <p className="text-black alert alert-success">
                                            Thank you <strong>{`${user?.first_name} ${user?.last_name}`}!</strong> Your order have been
                                            received !{' '}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div ref={printRef} className="invoice__wrapper grey-bg-2 pt-40 pb-40 pl-40 pr-40 tp-invoice-print-wrapper">
                            <div className="invoice__header-wrapper border-2 border-bottom border-white mb-40">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="invoice__header pb-20">
                                            <div className="row align-items-end">
                                                <div className="col-md-4 col-sm-6">
                                                    <div className="invoice__left">
                                                        <Image src={logo} alt="logo" />
                                                        <p>
                                                            1 Vo Van Ngan, Linh Chieu Ward, <br /> Thu Duc City, Ho Chi Minh City.{' '}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="col-md-8 col-sm-6">
                                                    <div className="invoice__right mt-15 mt-sm-0 text-sm-end">
                                                        <h3 className="text-uppercase font-70 mb-20">Invoice</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="invoice__customer mb-30">
                                <div className="row">
                                    <div className="col-md-6 col-sm-8">
                                        <div className="invoice__customer-details">
                                            <h5 className="mb-8 text-uppercase">
                                                {address?.detail_address}, {address?.commune}, {address?.district}, {address?.province}
                                            </h5>
                                            <p className="mb-0 text-uppercase">{address?.country_name}</p>
                                            <p className="mb-0 text-uppercase">{address?.city}</p>
                                            <p className="mb-0">{address?.phone_number}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-sm-4">
                                        <div className="invoice__details mt-md-0 mt-20 text-md-end">
                                            <p className="mb-0">
                                                <strong>Invoice ID:</strong> #{shop_order_id}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Date:</strong> {dayjs(order_date).format('MMMM D, YYYY')}
                                            </p>
                                            <p className="mb-0">{`${user?.first_name} ${user?.last_name}`}</p>
                                            <p className="mb-0">{`${user?.email}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="invoice__order-table pt-30 pb-30 pl-40 pr-40 bg-white mb-30">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">SL</th>
                                            <th scope="col">Product</th>
                                            <th scope="col">Qty</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody className="table-group-divider">
                                        {orderItems?.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.qty}</td>
                                                <td>{Helper.formatCurrency(item.price)}</td>
                                                <td>{Helper.formatCurrency(item.sub_total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="invoice__total pt-40 pb-10 alert-success pl-40 pr-40 mb-30">
                                <div className="row">
                                    <div className="col-lg-3 col-md-4">
                                        <div className="invoice__payment-method mb-30">
                                            <h5 className="mb-0">Payment Method</h5>
                                            <p className="tp-font-medium text-uppercase">{payment_method_name}</p>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-md-4">
                                        <div className="invoice__discount-cost mb-30">
                                            <h5 className="mb-0">Discount</h5>
                                            <p className="tp-font-medium">{Helper.formatCurrency(discount)}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-4">
                                        <div className="invoice__total-ammount mb-30">
                                            <h5 className="mb-0">Total Amount</h5>
                                            <p className="tp-font-medium text-danger">
                                                <strong>{Helper.formatCurrency(order_total_price)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="invoice__print text-end mt-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <ReactToPrint
                                        trigger={() => (
                                            <button type="button" className="tp-invoice-print tp-btn tp-btn-black">
                                                <span className="mr-5">
                                                    <i className="fa-regular fa-print"></i>
                                                </span>{' '}
                                                Print
                                            </button>
                                        )}
                                        content={() => printRef.current}
                                        documentTitle="Invoice"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Wrapper>
                <SEO pageTitle={'Order Details'} />
                <HeaderTwo style_2={true} />
                {content}
                <Footer primary_style={true} />
            </Wrapper>
        </>
    );
};

export const getServerSideProps = async ({ params }) => {
    return {
        props: { params }
    };
};

export default SingleOrder;
