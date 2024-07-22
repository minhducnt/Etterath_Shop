import { CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// internal
import useCartInfo from '@/global/hooks/use-cart-info';
import ErrorMsg from '../common/error-msg';
import { Helper } from '@/global/utils/helpers/misc';

const CheckoutOrderArea = ({ checkoutData }) => {
    const {
        handleShippingCost,
        cartTotal = 0,
        stripe,
        isCheckoutSubmit,
        clientSecret,
        register,
        errors,
        showCard,
        setShowCard,
        shippingCost,
        discountAmount
    } = checkoutData;

    const { cart_products } = useSelector(state => state.cart);
    const { total } = useCartInfo();

    return (
        <div className="tp-checkout-place white-bg">
            <h3 className="tp-checkout-place-title">Your Order</h3>

            <div className="tp-order-info-list pt-25">
                <ul>
                    {/*  header */}
                    <li className="tp-order-info-list-header">
                        <h4>Product</h4>
                        <h4>Total</h4>
                    </li>

                    {/*  item list */}
                    {cart_products.map(item => (
                        <li key={item.product_id} className="tp-order-info-list-desc">
                            <p>
                                {item.product_name} <span> x {item.orderQuantity}</span>
                            </p>
                            <span>{Helper.formatCurrency(item.price)}</span>
                        </li>
                    ))}

                    {/*  shipping */}
                    <li className="tp-order-info-list-shipping">
                        <span>Shipping</span>
                        <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                            <span>
                                <input
                                    {...register(`shippingOption`, {
                                        required: `Shipping Option is required!`
                                    })}
                                    id="flat_shipping"
                                    type="radio"
                                    name="shippingOption"
                                />
                                <label onClick={() => handleShippingCost(60000)} htmlFor="flat_shipping">
                                    Delivery: Today Cost: <span>{Helper.formatCurrency(60000)}</span>
                                </label>
                                <ErrorMsg msg={errors?.shippingOption?.message} />
                            </span>
                            <span>
                                <input
                                    {...register(`shippingOption`, {
                                        required: `Shipping Option is required!`
                                    })}
                                    id="flat_rate"
                                    type="radio"
                                    name="shippingOption"
                                />
                                <label onClick={() => handleShippingCost(20000)} htmlFor="flat_rate">
                                    Delivery: 7 Days Cost: <span>{Helper.formatCurrency(20000)}</span>
                                </label>
                                <ErrorMsg msg={errors?.shippingOption?.message} />
                            </span>
                        </div>
                    </li>

                    {/*  subtotal */}
                    <li className="tp-order-info-list-subtotal">
                        <span>Subtotal</span>
                        <span>{Helper.formatCurrency(total)}</span>
                    </li>

                    {/*  shipping cost */}
                    <li className="tp-order-info-list-subtotal">
                        <span>Shipping Cost</span>
                        <span>{Helper.formatCurrency(shippingCost)}</span>
                    </li>

                    {/* discount */}
                    <li className="tp-order-info-list-subtotal">
                        <span>Discount</span>
                        <span>{Helper.formatCurrency(discountAmount)}</span>
                    </li>

                    {/* total */}
                    <li className="tp-order-info-list-total">
                        <span>Total</span>
                        <span>{Helper.formatCurrency(cartTotal)}</span>
                    </li>
                </ul>
            </div>

            <div className="tp-checkout-payment">
                <div className="tp-checkout-payment-item">
                    <input
                        {...register(`payment`, {
                            required: `Payment Option is required!`
                        })}
                        type="radio"
                        id="back_transfer"
                        name="payment"
                        value="Card"
                    />
                    <label onClick={() => setShowCard(true)} htmlFor="back_transfer" data-bs-toggle="direct-bank-transfer">
                        Credit Card
                    </label>
                    {showCard && (
                        <div className="direct-bank-transfer pt-2">
                            <div className="payment_card">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4'
                                                }
                                            },
                                            invalid: {
                                                color: '#9e2146'
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <ErrorMsg msg={errors?.payment?.message} />
                </div>

                <div className="tp-checkout-payment-item">
                    <input
                        {...register(`payment`, {
                            required: `Payment Option is required!`
                        })}
                        onClick={() => setShowCard(false)}
                        type="radio"
                        id="cod"
                        name="payment"
                        value="COD"
                    />
                    <label htmlFor="cod">Cash on Delivery</label>
                    <ErrorMsg msg={errors?.payment?.message} />
                </div>
            </div>

            <div className="tp-checkout-btn-wrapper">
                <button type="submit" disabled={!stripe || isCheckoutSubmit} className="tp-checkout-btn w-100">
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default CheckoutOrderArea;
