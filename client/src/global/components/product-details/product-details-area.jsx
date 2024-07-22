import React, { useState, useEffect, use } from 'react';
// internal
import DetailsThumbWrapper from './details-thumb-wrapper';
import DetailsWrapper from './details-wrapper';
import DetailsTabNav from './details-tab-nav';

import { useGetAllProductItemsQuery } from '@/redux/features/productApi';
import { useFindAllReviewsQuery } from '@/redux/features/reviewApi';
import Loader from '../loader/loader';

const ProductDetailsArea = ({ productItem }) => {
    const { product_id, images } = productItem || {};

    const [activeImg, setActiveImg] = useState();
    const [activeVariation, setActiveVariation] = useState();
    const [totalQuantity, setTotalQuantity] = useState(0);

    const [productDetail, setProductDetail] = useState([]);
    const { data: detailData, isLoading, isFetching } = useGetAllProductItemsQuery(product_id);

    const [reviews, setReviews] = useState([]);
    const { data: reviewsData } = useFindAllReviewsQuery(product_id);

    // set product detail
    useEffect(() => {
        const newResult =
            detailData?.data
                ?.flat()
                .filter(Boolean)
                .map(item => ({
                    product_item_id: item.product_item_id,
                    sku: item.sku,
                    qty_in_stock: item.qty_in_stock,
                    variation_values: item.variation_values
                })) ?? [];

        if (newResult.length > 0) {
            const totalQty = newResult.reduce((acc, item) => acc + item.qty_in_stock, 0);
            setTotalQuantity(totalQty);
        } else {
            setTotalQuantity(0);
        }

        setProductDetail(newResult);
    }, [detailData]);

    // get all reviews
    useEffect(() => {
        if (Array.isArray(reviewsData?.data)) {
            setReviews(
                reviewsData?.data
                    ?.flat()
                    .filter(Boolean)
                    .map(review => ({
                        id: review.id,
                        user_id: review.user_id,
                        rating: review.rating,
                        content: review.content,
                        updated_at: review.created_at,
                        user: review.user
                    }))
            );
        } else {
            setReviews([]);
        }
    }, [reviewsData]);

    // active image change when img change
    useEffect(() => {
        setActiveImg(images[0]);
    }, [images]);

    useEffect(() => {
        if (productDetail.length > 0) {
            const selectedVariation = {
                product_item_id: productDetail[0].product_item_id,
                sku: productDetail[0].sku,
                qty_in_stock: productDetail[0].qty_in_stock,
                variation_values: productDetail[0].variation_values,
                selected_variation_value: productDetail[0].variation_values[0].variation_value
            };

            setActiveVariation(selectedVariation);
        }
    }, [productDetail]);

    // handle image active
    const handleImageActive = item => {
        setActiveImg(item);
    };

    // handle variation active
    const handleVariationActive = item => {
        setActiveVariation(item);
        console.log('activeVariation', activeVariation);
    };

    if (isLoading || isFetching)
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <Loader spinner="fade" loading={isLoading} />
            </div>
        );
    return (
        <section className="tp-product-details-area">
            <div className="tp-product-details-top pb-115">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-lg-6">
                            <DetailsThumbWrapper
                                activeImg={activeImg}
                                handleImageActive={handleImageActive}
                                imageURLs={images}
                                imgWidth={700}
                                imgHeight={700}
                                qty_in_stock={totalQuantity}
                            />
                        </div>

                        <div className="col-xl-5 col-lg-6">
                            <DetailsWrapper
                                productItem={productItem}
                                productDetail={productDetail}
                                reviews={reviews}
                                handleVariationActive={handleVariationActive}
                                activeVariation={activeVariation}
                                detailsBottom={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="tp-product-details-bottom pb-140">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <DetailsTabNav product={productItem} reviews={reviews} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetailsArea;
