import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
// internal
import { CompareThree, QuickView, Wishlist } from '@svgs';
import { handleProductModal } from '@/redux/features/productModalSlice';
import { add_cart_product } from '@/redux/features/cart/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist/wishlistSlice';
import { add_to_compare } from '@/redux/features/compareSlice';

import emptyImg from '@assets/img/error/onErrorItem.svg';

const ShopArea = ({ product }) => {
    const dispatch = useDispatch();
    const [imageVal, setImageVal] = useState(emptyImg);

    const { product_id, images, product_name, price, discount_price } = product || {};

    // handle product image
    useEffect(() => {
        images && images.length > 0 ? setImageVal(images[0]) : setImageVal(emptyImg);
    }, [images]);

    // handle add product
    const handleAddProduct = prd => {
        dispatch(add_cart_product(prd));
    };
    // handle wishlist product
    const handleWishlistProduct = prd => {
        dispatch(add_to_wishlist(prd));
    };

    // handle compare product
    const handleCompareProduct = prd => {
        dispatch(add_to_compare(prd));
    };

    return (
        <div className="tp-product-list-item d-md-flex">
            <div className="tp-product-list-thumb p-relative fix">
                <Link href={`/product-details/${product_id}`}>
                    <Image src={imageVal} fallback={emptyImg} alt="product img" width={350} height={310} />
                </Link>

                {/* <!-- product action --> */}
                <div className="tp-product-action-2 tp-product-action-blackStyle">
                    <div className="tp-product-action-item-2 d-flex flex-column">
                        <button
                            type="button"
                            className="tp-product-action-btn-2 tp-product-quick-view-btn"
                            onClick={() => dispatch(handleProductModal(product))}
                        >
                            <QuickView />
                            <span className="tp-product-tooltip tp-product-tooltip-right">Quick View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleWishlistProduct(product)}
                            className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn"
                        >
                            <Wishlist />
                            <span className="tp-product-tooltip tp-product-tooltip-right">Add To Wishlist</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCompareProduct(product)}
                            className="tp-product-action-btn-2 tp-product-add-to-compare-btn"
                        >
                            <CompareThree />
                            <span className="tp-product-tooltip tp-product-tooltip-right">Add To Compare</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="tp-product-list-content">
                <div className="tp-product-content-2 pt-15">
                    <h3 className="tp-product-title-2">
                        <Link href={`/product-details/${product_id}`} style={{ textDecoration: 'none' }}>
                            {product_name}
                        </Link>
                    </h3>

                    <div className="tp-product-price-wrapper-2">
                        {discount_price > 0 ? (
                            <>
                                <span className="tp-product-price-2 new-price">${price}</span>
                                <span className="tp-product-price-2 old-price">
                                    {' '}
                                    ${(Number(price) - (Number(price) * Number(discount_price)) / 100).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="tp-product-price-2 new-price">${price}</span>
                        )}
                    </div>

                    {/* <p>{description.substring(0, 100)}</p> */}
                    <div className="tp-product-list-add-to-cart">
                        <button onClick={() => handleAddProduct(product)} className="tp-product-list-add-to-cart-btn">
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopArea;
