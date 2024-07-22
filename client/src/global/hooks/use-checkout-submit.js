import { set_shipping } from '@/redux/features/order/orderSlice';
import { set_coupon } from '@/redux/features/coupon/couponSlice';
import { notifyError, notifySuccess } from '@/global/utils/toastify';
import {
    useSaveOrderMutation,
    useSaveOrderCodMutation,
    useSaveOrderStripeMutation,
    useVerifyOrderStripeMutation
} from '@/redux/features/order/orderApi';
import { useGetOfferCouponsQuery } from '@/redux/features/coupon/couponApi';
import { useApplyCouponMutation, useGetCartQuery } from '@/redux/features/cart/cartApi';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import * as dayjs from 'dayjs';

import { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import { useRouter } from 'next/router';

import Cookies from 'js-cookie';

import { Helper } from '../utils/helpers/misc';

import useCartInfo from './use-cart-info';

const useCheckoutSubmit = () => {
    // offerCoupons
    const { data: offerCoupons, isError, isLoading, refetch } = useGetOfferCouponsQuery();
    const [applyCoupon, {}] = useApplyCouponMutation();

    // addOrder
    const [saveOrder, {}] = useSaveOrderMutation();
    const [saveOrderCod, {}] = useSaveOrderCodMutation();
    const [saveOrderStripe, {}] = useSaveOrderStripeMutation();
    const [verifyOrderStripe, {}] = useVerifyOrderStripeMutation();

    // cart_products
    const { cart_products } = useSelector(state => state.cart);
    const { data: cartData } = useGetCartQuery();

    // user
    const { user } = useSelector(state => state.auth);

    // shipping_info
    const { shipping_info } = useSelector(state => state.order);

    // total amount
    const { total, setTotal } = useCartInfo();

    // couponInfo
    const [couponInfo, setCouponInfo] = useState({});

    //cartTotal
    const [cartTotal, setCartTotal] = useState('');

    // minimumAmount
    const [minimumAmount, setMinimumAmount] = useState(0);

    // shippingCost
    const [shippingCost, setShippingCost] = useState(0);

    // discountAmount
    const [discountAmount, setDiscountAmount] = useState(0);

    // discountPercentage
    const [discountPercentage, setDiscountPercentage] = useState(0);

    // discountProductType
    const [discountProductType, setDiscountProductType] = useState('');

    // isCheckoutSubmit
    const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);

    // cardError
    const [cardError, setCardError] = useState('');

    // clientSecret
    const [clientSecret, setClientSecret] = useState('');
    const [stripePaymentId, setStripePaymentId] = useState('');

    // showCard
    const [showCard, setShowCard] = useState(false);

    // coupon apply message
    const [couponApplyMsg, setCouponApplyMsg] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    let couponRef = useRef('');

    useEffect(() => {
        if (localStorage.getItem('couponInfo')) {
            const data = localStorage.getItem('couponInfo');
            const coupon = JSON.parse(data);
            setCouponInfo(coupon);
            setDiscountPercentage(coupon?.discount_rate);
        }
    }, []);

    useEffect(() => {
        if (minimumAmount - discountAmount > total || cart_products.length === 0) {
            setDiscountPercentage(0);
            localStorage.removeItem('couponInfo');
        }
    }, [minimumAmount, total, discountAmount, cart_products]);

    //calculate total and discount value
    useEffect(() => {
        const result = cart_products;
        const discountProductTotal = result?.reduce(
            (preValue, currentValue) => preValue + currentValue.price * currentValue.orderQuantity,
            0
        );
        let totalValue = '';
        let subTotal = Number((total + shippingCost).toFixed(2));
        let discountTotal = Number(discountProductTotal * (discountPercentage / 100));
        totalValue = Number(subTotal - discountTotal);
        setDiscountAmount(discountTotal);
        setCartTotal(totalValue);
    }, [total, shippingCost, discountPercentage, cart_products, discountProductType, discountAmount, cartTotal]);

    // handleCouponCode
    const handleCouponCode = e => {
        e.preventDefault();

        if (!couponRef.current?.value) {
            notifyError('Please Input a Coupon Code!');
            return;
        }
        if (isLoading) {
            return <h3>Loading...</h3>;
        }
        if (isError) {
            return notifyError('Something went wrong');
        }

        const coupons = offerCoupons?.data?.flat().filter(Boolean) ?? [];
        const result = coupons?.filter(coupon => coupon.coupon_code === couponRef.current?.value);

        if (result.length < 1) {
            notifyError('Please input a valid coupon!');
            return;
        }

        if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
            notifyError('This coupon is not valid!');
            return;
        }

        applyCoupon({
            coupon_code: couponRef.current?.value
        }).then(async data => {
            if (!data?.data) {
                const errorMessage = Object.values(data?.error?.data?.error ?? {})[0];
                notifyError(Helper.toSentenceCase(errorMessage ?? ''));
            } else {
                notifySuccess(data.data.message);

                refetch();

                if (total < result?.minimum_cart_price) {
                    notifyError(`Minimum ${Helper.formatCurrency(result?.minimum_cart_price)} required for Apply this coupon!`);
                    return;
                } else {
                    const [coupon] = result;

                    setCouponApplyMsg(`Your Coupon ${coupon?.coupon_code} is Applied!`);
                    setMinimumAmount(coupon?.minimum_cart_price);
                    setDiscountPercentage(coupon?.discount_rate);
                    dispatch(set_coupon(coupon));
                    setTimeout(() => {
                        couponRef.current.value = '';
                        setCouponApplyMsg('');
                    }, 5000);
                }
            }
        });
    };

    // handleShippingCost
    const handleShippingCost = value => {
        setShippingCost(value);
    };

    //set values
    useEffect(() => {
        if (user) {
            setValue('first_name', user.user.first_name);
            setValue('last_name', user.user.last_name);
            setValue('phone', user.user.phone);
            setValue('email', user.user.email);
        }
    }, [user, setValue, shipping_info, router]);

    // submitHandler
    const submitHandler = async data => {
        dispatch(set_shipping(data));
        setIsCheckoutSubmit(true);

        let address_id = JSON.parse(Cookies.get('defaultAddress')).address_id;

        let orderInfo = {
            name: `${data.first_name} ${data.last_name}`,
            contact: data.phone,
            email: data.email,
            address_id: address_id,
            shippingOption: data.shippingOption,
            cart: cart_products,
            paymentMethod: data.payment,
            subTotal: total,
            shippingCost: shippingCost,
            discount: discountAmount,
            totalAmount: cartTotal
        };

        if (data.payment === 'Card') {
            saveOrder({
                ...orderInfo
            }).then(res => {
                if (res?.error) {
                } else {
                    setIsCheckoutSubmit(false);
                    const shop_order_id = parseInt(localStorage.getItem('shop_order_id'));
                    saveOrderStripe({ shop_order_id })
                        .then(result => {
                            if (result?.error) {
                            } else {
                                notifySuccess('Your Order Confirmed!');
                                localStorage.removeItem('client_secret');
                                localStorage.setItem('client_secret', result.data.payment_order.client_secret);
                            }
                        })
                        .then(async () => {
                            if (!stripe || !elements) {
                                return;
                            }
                            const card = elements.getElement(CardElement);
                            if (card == null) {
                                return;
                            }
                            await stripe
                                .createPaymentMethod({
                                    type: 'card',
                                    card: card
                                })
                                .then(({ error, paymentMethod }) => {
                                    if (error && !paymentMethod) {
                                        setCardError(error.message);
                                        setIsCheckoutSubmit(false);
                                    } else {
                                        setCardError('');
                                        const orderData = {
                                            ...orderInfo,
                                            cardInfo: paymentMethod
                                        };

                                        return handlePaymentWithStripe(orderData);
                                    }
                                });
                        });
                }
            });
        }

        if (data.payment === 'COD') {
            saveOrder({
                ...orderInfo
            }).then(res => {
                if (res?.error) {
                } else {
                    setIsCheckoutSubmit(false);
                    const shop_order_id = parseInt(localStorage.getItem('shop_order_id'));

                    saveOrderCod({ shop_order_id });
                    notifySuccess('Your Order Confirmed!');
                    router.push(`/order/${shop_order_id}`);
                }
            });
        }
    };

    // handlePaymentWithStripe
    const handlePaymentWithStripe = async order => {
        try {
            const clientSecret = localStorage.getItem('client_secret');
            const { paymentIntent, error: intentErr } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user?.first_name + ' ' + user?.last_name,
                        email: user?.email
                    }
                }
            });
            if (intentErr) {
                notifyError(intentErr.message);
            } else {
                notifySuccess('Your payment processed successfully');
            }

            const orderData = {
                ...order,
                paymentIntent
            };
            const shop_order_id = parseInt(localStorage.getItem('shop_order_id'));
            console.log(orderData.paymentIntent.id);

            verifyOrderStripe({
                shop_order_id: shop_order_id,
                stripe_payment_id: orderData.paymentIntent.id
            }).then(result => {
                if (result?.error) {
                } else {
                    router.push(`/order/${shop_order_id}`);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    return {
        handleCouponCode,
        couponRef,
        handleShippingCost,
        discountAmount,
        total,
        shippingCost,
        discountPercentage,
        discountProductType,
        isCheckoutSubmit,
        setTotal,
        register,
        errors,
        cardError,
        submitHandler,
        stripe,
        handleSubmit,
        clientSecret,
        setClientSecret,
        cartTotal,
        isCheckoutSubmit,
        couponApplyMsg,
        showCard,
        setShowCard
    };
};

export default useCheckoutSubmit;
