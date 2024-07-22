import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
// internal
import { add_cart_product, remove_product, quantityDecrement } from '@/redux/features/cart/cartSlice';
import { useRemoveFromCartMutation, useAddToCartMutation, useUpdateCartMutation } from '@/redux/features/cart/cartApi';

import { Helper } from '@/global/utils/helpers/misc';

import { Close, Minus, Plus } from '@svgs';
import onErrorItem from '@assets/img/error/onErrorItem.svg';

const CartItem = ({ product }) => {
    const dispatch = useDispatch();

    const [addProductToCart] = useAddToCartMutation();
    const [updateCart] = useUpdateCartMutation();

    const [imageVal, setImageVal] = useState(onErrorItem);
    const [removeProductFromCart] = useRemoveFromCartMutation();

    const { product_id, images, product_name, price, orderQuantity = 0 } = product || {};

    // product image
    useEffect(() => {
        images && images.length > 0 ? setImageVal(images[0]) : setImageVal(onErrorItem);
    }, [images]);

    // handle add product
    const handleAddProduct = async prd => {
        await addProductToCart({ product_item_id: prd.product_item_id, qty: 1 }).unwrap();
        dispatch(add_cart_product(prd));
    };

    // handle remove product
    const handleRemovePrd = async prd => {
        await removeProductFromCart(prd.product_item_id).unwrap();
        dispatch(remove_product(prd));
    };

    // handle decrement quantity
    const handleDecrement = async prd => {
        await updateCart({ product_item_id: prd.product_item_id, qty: prd.orderQuantity - 1 }).unwrap();
        dispatch(quantityDecrement(prd));
    };

    return (
        <tr>
            {/* img */}
            <td className="tp-cart-img">
                <Link href={`/product-details/${product_id}`} as={`/product-details/${product_id}`}>
                    <Image
                        src={imageVal}
                        fallback={onErrorItem}
                        alt="product img"
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', width: '70px', height: '70px' }}
                        priority
                    />
                </Link>
            </td>

            {/* title */}
            <td className="tp-cart-title">
                <Link href={`/product-details/${product_id}`} style={{ textDecoration: 'none' }}>
                    {product_name}
                </Link>
            </td>

            {/* price */}
            <td className="tp-cart-price">
                <span>{Helper.formatCurrency(price)}</span>
            </td>

            {/* quantity */}
            <td className="tp-cart-quantity">
                <div className="tp-product-quantity mt-10 mb-10">
                    <span onClick={() => handleDecrement(product)} className="tp-cart-minus">
                        <Minus />
                    </span>
                    <input className="tp-cart-input" type="text" value={orderQuantity} readOnly />
                    <span onClick={() => handleAddProduct(product)} className="tp-cart-plus">
                        <Plus />
                    </span>
                </div>
            </td>

            {/* action */}
            <td className="tp-cart-action">
                <button onClick={() => handleRemovePrd(product)} className="tp-cart-action-btn">
                    <Close /> <span> Remove</span>
                </button>
            </td>
        </tr>
    );
};

export default CartItem;
