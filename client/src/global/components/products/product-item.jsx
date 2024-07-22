import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rating } from 'react-simple-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
// internal
import { add_cart_product } from '@/redux/features/cart/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist/wishlistSlice';
import { add_to_compare } from '@/redux/features/compareSlice';
import { handleProductModal } from '@/redux/features/productModalSlice';

import { useAddToCartMutation } from '@/redux/features/cart/cartApi';
import { useAddToWishlistMutation } from '@/redux/features/wishlist/wishlistApi';
import { useGetAllProductItemsQuery } from '@/redux/features/productApi';
import { useFindAllReviewsQuery } from '@/redux/features/reviewApi';

import { notifyError } from '@/global/utils/toastify';
import { Helper } from '@/global/utils/helpers/misc';

import Timer from '@/global/components/common/timer';
import onErrorItem from '@assets/img/error/onErrorItem.svg';
import { Cart, CompareThree, QuickView, Wishlist } from '@svgs';

const ProductItem = ({ product, offer_style = false }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const [addProductToCart] = useAddToCartMutation();
    const [addProductToWishlist] = useAddToWishlistMutation();

    const [ratingVal, setRatingVal] = useState(0);
    const [imageVal, setImageVal] = useState(onErrorItem);

    const { product_id, images, main_category_name, category_name, product_name, price, discount_price, end_date } = product || {};

    const [productItems, setProductItems] = useState([]);
    const { data: listItem } = useGetAllProductItemsQuery(product_id);

    const [productReviews, setProductReviews] = useState([]);
    const { data: listReview } = useFindAllReviewsQuery(product_id);

    // product image
    useEffect(() => {
        images && images.length > 0 ? setImageVal(images[0]) : setImageVal(onErrorItem);
    }, [images]);

    // product item
    useEffect(() => {
        if (listItem && Array.isArray(listItem.data)) {
            const res = listItem?.data?.flat() ?? [];
            res.length > 0 && res[0] !== null ? setProductItems(res) : setProductItems([]);
        } else {
            setProductItems([]);
        }
    }, [listItem]);

    // product rating
    useEffect(() => {
        if (listReview && Array.isArray(listReview.data)) {
            const res = listReview?.data?.flat() ?? [];
            res.length > 0 && res[0] !== null ? setProductReviews(res) : setProductReviews([]);
        } else {
            setProductReviews([]);
        }
    }, [listReview]);

    useEffect(() => {
        if (productReviews && productReviews.length > 0) {
            const result = productReviews;
            const rating = result.reduce((acc, review) => acc + parseInt(review.rating), 0) / productReviews.length;
            setRatingVal(rating);
        } else {
            setRatingVal(0);
        }
    }, [productReviews]);

    // handle cart/wishlist/compare
    const { cart_products } = useSelector(state => state.cart);
    const { wishlist } = useSelector(state => state.wishlist);

    const isAddedToCart = cart_products.some(prd => prd.product_id === product_id);
    const isAddedToWishlist = wishlist.some(prd => prd.product_id === product_id);

    // handle add product
    const handleAddProduct = async (prd, prdItems) => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (prdItems.length > 1) {
            router.push(`/product-details/${product_id}`);
            return;
        }

        try {
            await addProductToCart({ product_item_id: prdItems[0].product_item_id, qty: 1 }).unwrap();

            const newItem = {
                ...prd,
                product_item_id: prdItems[0].product_item_id
            };

            dispatch(add_cart_product(newItem));
        } catch (error) {
            notifyError(`${prd.product_name} already exist in the cart`);
        }
    };

    // handle wishlist product
    const handleWishlistProduct = async (prd, prdItems) => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (prdItems.length > 1) {
            router.push(`/product-details/${product_id}`);
            return;
        }

        try {
            await addProductToWishlist(prdItems[0].product_item_id).unwrap();

            const newItem = {
                ...prd,
                product_item_id: prdItems[0].product_item_id
            };

            dispatch(add_to_wishlist(newItem));
        } catch (error) {
            notifyError(`${prd.product_name} already exist in the wishlist`);
        }
    };

    // handle compare product
    const handleCompareProduct = async (prd, prdItems) => {
        const newItem = {
            ...prd,
            product_item_id: prdItems[0].product_item_id
        };

        dispatch(add_to_compare(newItem));
    };

    return (
        <>
            <div className={`${offer_style ? 'tp-product-offer-item' : 'mb-25'} tp-product-item transition-3`}>
                <div className="tp-product-thumb p-relative fix">
                    <Link href={`/product-details/${product_id}`} as={`/product-details/${product_id}`}>
                        <Image
                            src={imageVal}
                            fallback={onErrorItem}
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ display: 'block', margin: '0 auto', width: '250px', height: '250px', objectFit: 'contain' }}
                            alt="product"
                            priority
                        />
                        <div className="tp-product-badge">
                            {productItems.qty_in_stock === 0 && <span className="product-hot">out-stock</span>}
                        </div>
                    </Link>

                    {/*  product action */}
                    <div className="tp-product-action">
                        <div className="tp-product-action-item d-flex flex-column">
                            {isAddedToCart ? (
                                <Link
                                    href="/cart"
                                    className={`tp-product-action-btn ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
                                >
                                    <Cart />
                                    <span className="tp-product-tooltip">View Cart</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => handleAddProduct(product, productItems)}
                                    type="button"
                                    className={`tp-product-action-btn ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
                                    disabled={productItems.qty_in_stock === 0}
                                >
                                    <Cart />
                                    <span className="tp-product-tooltip">Add to Cart</span>
                                </button>
                            )}

                            {/* <button
                                onClick={() => dispatch(handleProductModal({ productItem: product, productDetail: productItems }))}
                                type="button"
                                className="tp-product-action-btn tp-product-quick-view-btn"
                            >
                                <QuickView />
                                <span className="tp-product-tooltip">Quick View</span>
                            </button> */}

                            {isAddedToWishlist ? (
                                <Link
                                    href="/wishlist"
                                    className={`tp-product-action-btn ${isAddedToWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}
                                >
                                    <Wishlist />
                                    <span className="tp-product-tooltip">View Wishlist</span>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    className={`tp-product-action-btn ${isAddedToWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}
                                    onClick={() => handleWishlistProduct(product, productItems)}
                                    disabled={productItems.qty_in_stock === 0}
                                >
                                    <Wishlist />
                                    <span className="tp-product-tooltip">Add To Wishlist</span>
                                </button>
                            )}

                            <button
                                disabled={productItems.qty_in_stock === 0}
                                onClick={() => handleCompareProduct(product, productItems)}
                                className="tp-product-action-btn tp-product-add-to-compare-btn"
                            >
                                <CompareThree />
                                <span className="tp-product-tooltip">Add To Compare</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/*  product content */}
                <div className="tp-product-content">
                    <div className="tp-product-category">
                        <a href="#" style={{ textDecoration: 'none' }}>
                            {main_category_name} - {category_name}
                        </a>
                    </div>

                    <h3 className="tp-product-title pt-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link href={`/product-details/${product_id}`} style={{ textDecoration: 'none' }}>
                            {product_name}
                        </Link>
                    </h3>

                    <div className="tp-product-rating d-flex align-items-center">
                        <div className="tp-product-rating-icon">
                            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
                        </div>
                        <div className="tp-product-rating-text">
                            <span>({productReviews && productReviews.length > 0 ? productReviews.length : 0} Reviews)</span>
                        </div>
                    </div>

                    <div className="tp-product-price-wrapper pt-2">
                        {discount_price > 0 ? (
                            <>
                                <span className="tp-product-price old-price">{Helper.formatCurrency(price)} </span>
                                <span className="tp-product-price new-price">{Helper.formatCurrency(discount_price)}</span>
                            </>
                        ) : (
                            <span className="tp-product-price new-price">{Helper.formatCurrency(price)}</span>
                        )}
                    </div>

                    {offer_style && (
                        <div className="tp-product-countdown pt-2">
                            <div className="tp-product-countdown-inner">
                                {dayjs().isAfter(end_date) ? (
                                    <ul style={{ paddingLeft: 10 }}>
                                        <li>
                                            <span>{0}</span> Day
                                        </li>
                                        <li>
                                            <span>{0}</span> Hrs
                                        </li>
                                        <li>
                                            <span>{0}</span> Min
                                        </li>
                                        <li>
                                            <span>{0}</span> Sec
                                        </li>
                                    </ul>
                                ) : (
                                    <Timer expiryTimestamp={new Date(end_date)} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductItem;
