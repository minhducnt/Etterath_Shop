import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
// internal
import { add_cart_product } from '@/redux/features/cart/cartSlice';
import { useRemoveFromWishlistMutation } from '@/redux/features/wishlist/wishlistApi';
import { useAddToCartMutation } from '@/redux/features/cart/cartApi';
import { remove_wishlist_product } from '@/redux/features/wishlist/wishlistSlice';

import { Helper } from '@/global/utils/helpers/misc';

import { Close } from '@svgs';
import onErrorItem from '@assets/img/error/onErrorItem.svg';
import { notifyError } from '@/global/utils/toastify';

const WishlistItem = ({ product }) => {
    const dispatch = useDispatch();

    const [imageVal, setImageVal] = useState(onErrorItem);

    const [addProductToCart] = useAddToCartMutation();
    const [removeProductFromWishlist] = useRemoveFromWishlistMutation();

    const { product_id, images, product_name, price } = product || {};

    const { cart_products } = useSelector(state => state.cart);
    const isAddToCart = cart_products.find(item => item.product_id === product_id);

    // product image
    useEffect(() => {
        images && images.length > 0 ? setImageVal(images[0]) : setImageVal(onErrorItem);
    }, [images]);

    // handle add product
    const handleAddCart = async prd => {
        try {
            await addProductToCart(prd.product_item_id).unwrap();
            dispatch(add_cart_product(prd));
        } catch (error) {
            if (error.data && !error.data.error.includes('exist')) {
                notifyError(`Already exist in the cart`);
            }
        }
    };

    // handle remove product
    const handleRemoveWishlist = async prd => {
        try {
            await removeProductFromWishlist(prd.product_item_id).unwrap();
            dispatch(remove_wishlist_product(prd));
        } catch (error) {
            notifyError(error);
        }
    };

    return (
        <tr>
            <td className="tp-cart-img">
                <Link href={`/product-details/${product_id}`}>
                    <Image
                        src={imageVal}
                        fallback={onErrorItem}
                        alt="product img"
                        width={70}
                        height={100}
                        style={{ objectFit: 'cover', width: '70px', height: '70px' }}
                        priority
                    />
                </Link>
            </td>

            <td className="tp-cart-title">
                <Link href={`/product-details/${product_id}`} style={{ textDecoration: 'none' }}>
                    {product_name && product_name.length > 50 ? product_name.slice(0, 50) + '...' : product_name}
                </Link>
            </td>

            <td className="tp-cart-price">
                <span>{Helper.formatCurrency(price)}</span>
            </td>

            <td className="tp-cart-quantity">
                <div className="tp-product-quantity mt-10 mb-10">
                    <input className="tp-cart-input" type="text" value={isAddToCart ? isAddToCart?.orderQuantity : 0} readOnly />
                </div>
            </td>

            <td className="tp-cart-add-to-cart">
                <button onClick={() => handleAddCart(product)} type="button" className="tp-btn tp-btn-2 tp-btn-blue">
                    Add To Cart
                </button>
            </td>

            <td className="tp-cart-action">
                <button onClick={() => handleRemoveWishlist(product)} className="tp-cart-action-btn">
                    <Close />
                    <span> Remove</span>
                </button>
            </td>
        </tr>
    );
};

export default WishlistItem;
