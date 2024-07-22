import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Rating } from 'react-simple-star-rating';
import * as Yup from 'yup';
// internal
import ErrorMsg from '../common/error-msg';
import { useAddReviewMutation, useFindAllReviewsQuery } from '@/redux/features/reviewApi';
import { notifyError, notifySuccess } from '@/global/utils/toastify';

// schema
const schema = Yup.object().shape({
    comment: Yup.string().required().label('Comment')
});

const ReviewForm = ({ product_id, user, handleReview, handleBack, hasReviewed }) => {
    const [rating, setRating] = useState(0);

    const [addReview, {}] = useAddReviewMutation();
    const { refetch } = useFindAllReviewsQuery(product_id);

    // Catch Rating value
    const handleRating = rate => {
        setRating(rate);
    };

    // react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    // on submit
    const onSubmit = data => {
        if (!user) {
            notifyError('Please login first');
            return;
        } else {
            addReview({
                userId: user?.id,
                productId: product_id,
                content: data.comment,
                rating: rating
            }).then(async result => {
                reset();
                setRating(0);

                if (result?.error) {
                    notifyError(result?.error?.data?.message);
                } else {
                    notifySuccess(result?.data?.message);
                    await refetch();
                    handleReview();
                    hasReviewed();
                }
            });
        }
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tp-product-details-review-form-rating d-flex align-items-center">
                <p>Your Rating :</p>
                <div className="tp-product-details-review-form-rating-icon d-flex align-items-center">
                    <Rating onClick={handleRating} allowFraction size={16} initialValue={rating} />
                </div>
            </div>

            <div className="tp-product-details-review-input-wrapper">
                <div className="tp-product-details-review-input-box">
                    <div className="tp-product-details-review-input">
                        <textarea
                            {...register('comment', { required: `Comment is required!` })}
                            id="comment"
                            name="comment"
                            placeholder="Write your review here..."
                        />
                    </div>

                    <div className="tp-product-details-review-input-title">
                        <label htmlFor="msg">Your Review</label>
                    </div>

                    <ErrorMsg msg={errors.name?.comment} />
                </div>
            </div>

            <div className="tp-product-details-review-btn-wrapper mt-20">
                <button type="submit" className="tp-product-details-review-btn" style={{ marginRight: '24px' }}>
                    Submit
                </button>
                <button
                    className="tp-product-details-review-btn"
                    onClick={handleBack}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#000',
                        border: '1px solid #000'
                    }}
                >
                    Back
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
