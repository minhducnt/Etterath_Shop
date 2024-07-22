import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { add_cart_product } from '@/redux/features/cart/cartSlice';
import { remove_compare_product } from '@/redux/features/compareSlice';

import { useAddToCartMutation } from '@/redux/features/cart/cartApi';

import emptyImg from '@assets/img/error/onErrorItem.svg';
import { Helper } from '@/global/utils/helpers/misc';
import { notifyError } from '@/global/utils/toastify';
import { Rating } from 'react-simple-star-rating';

const CompareArea = () => {
    const router = useRouter();

    const { compareItems } = useSelector(state => state.compare);
    const dispatch = useDispatch();

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const [addProductToCart] = useAddToCartMutation();

    // handle add product
    const handleAddProduct = async prd => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            await addProductToCart({ product_item_id: prd.product_item_id, qty: 1 }).unwrap();

            const newItem = {
                ...prd,
                product_item_id: prd.product_item_id
            };

            dispatch(add_cart_product(newItem));
        } catch (error) {
            notifyError(`${prd.product_name} already exist in the cart`);
        }
    };

    // handle add product
    const handleRemoveComparePrd = prd => {
        dispatch(remove_compare_product(prd));
    };

    let properties = compareItems.map(item => {
        if (item.properties.trim() !== null && item.properties.trim() !== '') {
            return { ...item, properties: JSON.parse(item.properties) };
        } else {
            return { ...item, properties: [] };
        }
    });
    localStorage.setItem('compareItems', JSON.stringify(compareItems));

    return (
        <>
            <section className="tp-compare-area pb-200">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            {compareItems.length === 0 && (
                                <div className="text-center pt-150">
                                    <h3>No Compare Items Found</h3>
                                    <Link href="/shop" className="tp-cart-checkout-btn mt-20" style={{ textDecoration: 'none' }}>
                                        Continue Shipping
                                    </Link>
                                </div>
                            )}

                            {compareItems.length > 0 && (
                                <div className="tp-compare-table table-responsive text-center">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Products</th>
                                                {compareItems.map(item => (
                                                    <td key={item.product_id}>
                                                        <div className="tp-compare-thumb">
                                                            <Image
                                                                src={item.images[0]}
                                                                fallback={emptyImg}
                                                                alt="compare"
                                                                width={205}
                                                                height={176}
                                                            />
                                                            <h4 className="tp-compare-product-title">
                                                                <Link
                                                                    href={`/product-details/${item.product_id}`}
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    {item.product_name && item.product_name.length > 50
                                                                        ? item.product_name.slice(0, 50) + '...'
                                                                        : item.product_name}
                                                                </Link>
                                                            </h4>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Description */}
                                            {properties && properties.some(item => item.properties && item.properties.length > 0) && (
                                                <tr>
                                                    <th>Details</th>
                                                    {properties.map(item => (
                                                        <td key={item.product_id}>
                                                            {item.properties && item.properties.length > 0 ? (
                                                                <ul
                                                                    style={{
                                                                        textAlign: 'left',
                                                                        verticalAlign: 'middle',
                                                                        marginBottom: '0px'
                                                                    }}
                                                                >
                                                                    {item.properties.map((attr, i) => (
                                                                        <li key={i}>
                                                                            {attr.key}:{' '}
                                                                            <span style={{ fontWeight: 'normal' }}>{attr.value}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="tp-compare-no-properties">No details available</div>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )}

                                            {/* Price */}
                                            <tr>
                                                <th>Price</th>
                                                {compareItems.map(item => (
                                                    <td key={item.product_id}>
                                                        <div className="tp-compare-price">
                                                            <span>{Helper.formatCurrency(item.price)}</span>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Add to cart*/}
                                            <tr>
                                                <th>Actions</th>
                                                {compareItems.map(item => (
                                                    <td key={item.product_id}>
                                                        <div className="tp-compare-add-to-cart">
                                                            <button onClick={() => handleAddProduct(item)} type="button" className="tp-btn">
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                            {/* Rating */}
                                            {/* <tr>
                                                <th>Rating</th>
                                                {compareItems.map(item => (
                                                    <td key={item.product_id}>
                                                        <div className="tp-compare-rating">
                                                            <Rating allowFraction size={16} initialValue={0} readonly={true} />
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr> */}

                                            {/* Remove */}
                                            <tr>
                                                <th>Remove</th>
                                                {compareItems.map(item => (
                                                    <td key={item.product_id}>
                                                        <div className="tp-compare-remove">
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveComparePrd({
                                                                        title: item.product_name,
                                                                        id: item.product_id
                                                                    })
                                                                }
                                                            >
                                                                <i className="fal fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CompareArea;
