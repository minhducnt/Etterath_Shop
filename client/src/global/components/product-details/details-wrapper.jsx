import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rating } from 'react-simple-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// internal
import DetailsBottomInfo from './details-bottom-info';
import ProductQuantity from './product-quantity';
import { add_cart_product } from '@/redux/features/cart/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist/wishlistSlice';
import { add_to_compare } from '@/redux/features/compareSlice';
import { handleModalClose } from '@/redux/features/productModalSlice';

import { useAddToCartMutation } from '@/redux/features/cart/cartApi';
import { useAddToWishlistMutation } from '@/redux/features/wishlist/wishlistApi';

import { notifyError } from '@/global/utils/toastify';
import { Helper } from '@/global/utils/helpers/misc';

import { CompareTwo, WishlistTwo } from '@svgs';

const DetailsWrapper = ({
    productItem,
    productDetail,
    reviews,
    handleVariationActive,
    activeVariation,
    detailsBottom = false,
    isModal = false
}) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const { orderQuantity } = useSelector(state => state.cart);

    const [addProductToCart] = useAddToCartMutation();
    const [addProductToWishlist] = useAddToWishlistMutation();

    const { brand_name, category_name, discount_price, main_category_name, product_name, qty_in_stock, price } = productItem || {};

    const [categoryVal, setCategoryVal] = useState('');
    const [ratingVal, setRatingVal] = useState(0);

    useEffect(() => {
        const rating = reviews?.reduce((acc, review) => acc + parseInt(review.rating), 0) / reviews?.length || 0;
        setRatingVal(rating);
    }, [reviews]);

    useEffect(() => {
        main_category_name === category_name
            ? setCategoryVal(`${main_category_name} - ${category_name}`)
            : setCategoryVal(main_category_name);
    }, []);

    // handle add product
    const handleAddProduct = async (prd, prdItems) => {
        if (!user) {
            if (isModal) {
                dispatch(handleModalClose());
            }

            router.push('/login');
            return;
        }

        try {
            await addProductToCart({ product_item_id: prdItems.product_item_id, qty: orderQuantity }).unwrap();

            const newItem = {
                ...prd,
                product_item_id: prdItems.product_item_id,
                selected_variation_value: prdItems.selected_variation_value
            };

            dispatch(add_cart_product(newItem));

            if (isModal) {
                dispatch(handleModalClose());
            }
        } catch (error) {
            notifyError(`${prd.product_name} already exist in the cart`);
        }
    };

    // handle wishlist product
    const handleWishlistProduct = async (prd, prdItems) => {
        if (!user) {
            if (isModal) {
                dispatch(handleModalClose());
            }

            router.push('/login');
            return;
        }

        try {
            await addProductToWishlist(prdItems.product_item_id).unwrap();

            const newItem = {
                ...prd,
                product_item_id: prdItems.product_item_id
            };

            dispatch(add_to_wishlist(newItem));

            if (isModal) {
                dispatch(handleModalClose());
            }
        } catch (error) {
            notifyError(`${prd.product_name} already exist in the wishlist`);
        }
    };

    // handle compare product
    const handleCompareProduct = (prd, prdItems) => {
        if (isModal) {
            dispatch(handleModalClose());
        }

        const newItem = {
            ...prd,
            product_item_id: prdItems.product_item_id
        };

        dispatch(add_to_compare(newItem));
    };

    // handle buy now
    const handleBuyNow = async (prd, prdItems) => {
        if (!user) {
            if (isModal) {
                dispatch(handleModalClose());
            }

            router.push('/login');
            return;
        }

        try {
            await addProductToCart({ product_item_id: prdItems.product_item_id, qty: orderQuantity }).unwrap();

            const newItem = {
                ...prd,
                product_item_id: prdItems.product_item_id,
                selected_variation_value: prdItems.selected_variation_value
            };

            dispatch(add_cart_product(newItem));

            if (isModal) {
                dispatch(handleModalClose());
            } else {
                router.push('/cart');
            }
        } catch (error) {
            notifyError(`${prd.product_name} already exist in the cart`);
        }
    };

    const groupedVariations = productDetail.reduce((acc, item) => {
        (item.variation_values || []).forEach(val => {
            if (!acc[val.variation_name]) {
                acc[val.variation_name] = [];
            }
            acc[val.variation_name].push({
                ...item,
                variation_value: val.variation_value,
                isSelected:
                    activeVariation?.selected_variation_value !== null && activeVariation?.selected_variation_value !== undefined
                        ? activeVariation?.selected_variation_value === val.variation_value
                        : false
            });
        });
        return acc;
    }, {});

    return (
        <div className="tp-product-details-wrapper">
            <div className="tp-product-details-category mb-10">
                <span>{categoryVal}</span>
            </div>
            <h3 className="tp-product-details-title">{product_name}</h3>

            {/* inventory details */}
            <div className="tp-product-details-inventory d-flex align-items-center mb-10">
                <div className="tp-product-details-stock mb-10">
                    <span>{qty_in_stock === 0 ? 'Out of stock' : 'Hot'}</span>
                </div>

                <div className="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
                    <div className="tp-product-details-rating">
                        <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
                    </div>
                    <div className="tp-product-details-reviews">
                        <span>({reviews && reviews.length > 0 ? reviews.length : 0} Review)</span>
                    </div>
                </div>
            </div>

            {/* price */}
            <div className="tp-product-details-price-wrapper mb-10">
                {discount_price > 0 ? (
                    <>
                        <span className="tp-product-details-price old-price">{Helper.formatCurrency(price)}</span>
                        <span className="tp-product-details-price new-price" style={{ marginLeft: '10px' }}>
                            {Helper.formatCurrency(discount_price)}
                        </span>
                    </>
                ) : (
                    <span className="tp-product-details-price new-price">{Helper.formatCurrency(price)}</span>
                )}
            </div>

            {/* variations */}
            {productDetail.some(item => item?.variation_values) && (
                <div className="tp-product-details-variation">
                    <div className="tp-product-details-variation-item">
                        {Object.entries(groupedVariations).map(([variationName, items]) => (
                            <React.Fragment key={variationName}>
                                <h4 className="tp-product-details-variation-title pt-3">{variationName}</h4>
                                <div className="tp-product-details-variation-list">
                                    {items.map((item, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`tp-size-variation-btn ${item.isSelected === true ? 'active' : ''}`}
                                            onClick={() => {
                                                const selItem = {
                                                    ...item,
                                                    selected_variation_value: item.variation_value
                                                };

                                                return handleVariationActive(selItem);
                                            }}
                                        >
                                            {item.variation_value && (
                                                <span className="tp-color-variation-tootltip">{item.variation_value}</span>
                                            )}
                                            {item.variation_value}
                                        </button>
                                    ))}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* actions */}
            <div className="tp-product-details-action-wrapper">
                <h3 className="tp-product-details-action-title">Quantity</h3>
                <div className="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
                    <ProductQuantity />

                    <div className="tp-product-details-add-to-cart mb-20 w-100">
                        <button
                            disabled={qty_in_stock === 0}
                            onClick={() => handleAddProduct(productItem, activeVariation)}
                            className="tp-product-details-add-to-cart-btn w-100"
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
                <button
                    disabled={qty_in_stock === 0}
                    className="tp-product-details-buy-now-btn w-100"
                    onClick={() => handleBuyNow(productItem, activeVariation)}
                >
                    Buy Now
                </button>
            </div>

            <div className="tp-product-details-action-sm">
                <button
                    onClick={() => handleCompareProduct(productItem, activeVariation)}
                    type="button"
                    className="tp-product-details-action-sm-btn"
                >
                    <CompareTwo /> <span>Compare</span>
                </button>

                <button
                    onClick={() => handleWishlistProduct(productItem, activeVariation)}
                    type="button"
                    className="tp-product-details-action-sm-btn"
                >
                    <WishlistTwo /> Add Wishlist
                </button>
            </div>

            {detailsBottom && <DetailsBottomInfo category={main_category_name} sku={activeVariation?.sku} brand={brand_name} />}
        </div>
    );
};

export default DetailsWrapper;
