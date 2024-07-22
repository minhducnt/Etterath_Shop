import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
// internal
import useCartInfo from '@/global/hooks/use-cart-info';
import { closeCartMini, remove_product } from '@/redux/features/cart/cartSlice';
import { useRemoveFromCartMutation } from '@/redux/features/cart/cartApi';

import { notifyError } from '@/global/utils/toastify';
import { Helper } from '@/global/utils/helpers/misc';
import RenderCartProgress from './render-cart-progress';

import empty_img from '@assets/img/error/onErrorItem.svg';
import empty_cart_img from '@assets/img/product/cartmini/empty-cart.png';

const CartMiniSidebar = () => {
    const dispatch = useDispatch();
    const [removeProductFromCart] = useRemoveFromCartMutation();

    const { cart_products, cartMiniOpen } = useSelector(state => state.cart);
    const { total } = useCartInfo();

    const handleRemovePrd = async prd => {
        try {
            await removeProductFromCart(prd.product_item_id).unwrap();
            dispatch(remove_product(prd));
        } catch (error) {
            notifyError(`${prd.product_name} not exist on cart`);
        }
    };

    const handleCloseCartMini = () => {
        dispatch(closeCartMini());
    };

    return (
        <>
            <div className={`cartmini__area tp-all-font-roboto ${cartMiniOpen ? 'cartmini-opened' : ''}`}>
                <div className="cartmini__wrapper d-flex justify-content-between flex-column">
                    <div className="cartmini__top-wrapper">
                        <div className="cartmini__top p-relative">
                            <div className="cartmini__top-title">
                                <h4>Shopping cart</h4>
                            </div>
                            <div className="cartmini__close">
                                <button
                                    onClick={() => dispatch(closeCartMini())}
                                    type="button"
                                    className="cartmini__close-btn cartmini-close-btn"
                                >
                                    <i className="fal fa-times"></i>
                                </button>
                            </div>
                        </div>

                        {/* <div className="cartmini__shipping">
                            <RenderCartProgress />
                        </div> */}

                        {cart_products.length > 0 && (
                            <div className="cartmini__widget">
                                {cart_products.map(item => (
                                    <div key={item.product_id} className="cartmini__widget-item">
                                        <div className="cartmini__thumb">
                                            <Link href={`/product-details/${item.productproduct_id}`}>
                                                <Image
                                                    src={item.images[0]}
                                                    fallback={empty_img}
                                                    width={70}
                                                    height={70}
                                                    alt="product img"
                                                    style={{ objectFit: 'contain', width: '70px', height: '70px' }}
                                                    priority
                                                />
                                            </Link>
                                        </div>

                                        <div className="cartmini__content">
                                            <h5 className="cartmini__title">
                                                <Link href={`/product-details/${item.product_id}`} style={{ textDecoration: 'none' }}>
                                                    {item.product_name.slice(0, 48) + '...'}
                                                </Link>
                                            </h5>

                                            <div className="cartmini__price-wrapper">
                                                {item.discount_price > 0 ? (
                                                    <span className="cartmini__price">{Helper.formatCurrency(item.discount_price)}</span>
                                                ) : (
                                                    <span className="cartmini__price">{Helper.formatCurrency(item.price)}</span>
                                                )}
                                                <span className="cartmini__quantity"> x{item.orderQuantity}</span>
                                            </div>
                                        </div>
                                        <a onClick={() => handleRemovePrd(item)} className="cartmini__del cursor-pointer">
                                            <i className="fa-regular fa-xmark"></i>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* if no item in cart */}
                        {cart_products.length === 0 && (
                            <div className="cartmini__empty text-center">
                                <Image src={empty_cart_img} alt="empty-cart-img" height={128} width={undefined} />
                                <p>Your Cart is empty</p>
                                <Link
                                    href="/shop"
                                    className="tp-btn"
                                    style={{ textDecoration: 'none', marginBottom: '40px' }}
                                    onClick={handleCloseCartMini}
                                >
                                    Go to Shop
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="cartmini__checkout">
                        <div className="cartmini__checkout-title mb-30">
                            <h4>Subtotal:</h4>
                            <span>{Helper.formatCurrency(total)}</span>
                        </div>
                        <div className="cartmini__checkout-btn">
                            <Link
                                href="/cart"
                                onClick={handleCloseCartMini}
                                className="tp-btn mb-10 w-100"
                                style={{ textDecoration: 'none' }}
                            >
                                view cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={handleCloseCartMini}
                                className="tp-btn tp-btn-border w-100"
                                style={{ textDecoration: 'none' }}
                            >
                                checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* overlay start */}
            <div onClick={handleCloseCartMini} className={`body-overlay ${cartMiniOpen ? 'opened' : ''}`}></div>
            {/* overlay end */}
        </>
    );
};

export default CartMiniSidebar;
