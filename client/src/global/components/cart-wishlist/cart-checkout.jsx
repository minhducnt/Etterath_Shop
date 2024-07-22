import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
// internal
import useCartInfo from '@/global/hooks/use-cart-info';
import { Helper } from '@/global/utils/helpers/misc';

const CartCheckout = () => {
    const { total } = useCartInfo();
    return (
        <div className="tp-cart-checkout-wrapper">
            <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between">
                <span className="tp-cart-checkout-top-title">Subtotal</span>
                <span className="tp-cart-checkout-top-price">{Helper.formatCurrency(total)}</span>
            </div>

            <div className="tp-cart-checkout-shipping">
                <h4 className="tp-cart-checkout-shipping-title">Shipping</h4>
                <div className="tp-cart-checkout-shipping-option-wrapper">
                    <label htmlFor="flat_rate">
                        Delivery: Today Cost: <span>{Helper.formatCurrency(60000)}</span>
                    </label>

                    <label htmlFor="local_pickup">
                        Delivery: 7 Days Cost: <span>{Helper.formatCurrency(20000)}</span>
                    </label>
                </div>
            </div>

            <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
                <span>Total</span>
                <span>{Helper.formatCurrency(total)}</span>
            </div>

            <div className="tp-cart-checkout-proceed">
                <Link href="/checkout" className="tp-cart-checkout-btn w-100" style={{ textDecoration: 'none' }}>
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
};

export default CartCheckout;
