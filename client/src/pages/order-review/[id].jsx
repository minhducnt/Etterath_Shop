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
import ReviewForm from '@/global/components/forms/review-form';
import Link from 'next/link';

const ReviewOrder = ({ params }) => {
    const orderId = parseInt(params.id);
    const router = useRouter();
    const printRef = useRef();

    const [isLoadingPage, setPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const [order, setOrder] = useState({});
    const [orders, setOrders] = useState([[]]);
    const [orderItems, setOrderItems] = useState([[]]);

    const { data: ordersData, isError, isLoading } = useGetUserOrdersQuery();
    const { data: orderItemsData } = useGetUserOrderItemsByShopOrderIdQuery(orderId);

    const toggleEdit = () => setIsEditing(!isEditing);

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

    const handleReview = () => {
        toggleEdit();
    };

    const checkReviewed = () => {
        setHasReviewed(true);
    };

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
        content = (
            <>
                <section className="invoice__area pt-120 pb-120">
                    <div className="container">
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
                                                        <h3 className="text-uppercase font-70 mb-20">Review Product</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="invoice__order-table pt-30 pb-30 pl-40 pr-40 bg-white mb-30">
                                {isEditing ? (
                                    <div className="tp-product-details-review-form">
                                        <h3 className="tp-product-details-review-form-title">Review this product</h3>
                                        <p>Your email address will not be published. Required fields are marked *</p>
                                        {orderItems?.map((item, i) => (
                                            <ReviewForm
                                                key={i}
                                                product_id={item.product_id}
                                                user={user}
                                                handleReview={handleReview}
                                                handleBack={toggleEdit}
                                                hasReviewed={checkReviewed}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <table className="table">
                                        <thead className="table-light">
                                            <tr>
                                                <th scope="col">SL</th>
                                                <th scope="col">Product</th>
                                                <th scope="col">Qty</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="table-group-divider">
                                            {orderItems?.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <Link
                                                            href={`/product-details/${item.product_id}`}
                                                            as={`/product-details/${item.product_id}`}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            {item.product_name}
                                                        </Link>
                                                    </td>
                                                    <td>{item.qty}</td>
                                                    <td>{Helper.formatCurrency(item.price)}</td>
                                                    <td>{Helper.formatCurrency(item.sub_total)}</td>
                                                    <td>
                                                        <button
                                                            onClick={toggleEdit}
                                                            className="tp-logout-btn"
                                                            style={{
                                                                textDecoration: 'none',
                                                                color: hasReviewed ? '#fff' : '#000',
                                                                backgroundColor: hasReviewed ? '#000' : '#fff',
                                                                pointerEvents: hasReviewed ? 'none' : 'auto'
                                                            }}
                                                            disabled={hasReviewed}
                                                        >
                                                            <i className="fa-regular fa-edit" style={{ marginRight: '8px' }}></i>
                                                            Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
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

export default ReviewOrder;
