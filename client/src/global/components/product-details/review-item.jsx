import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
import { Rating } from 'react-simple-star-rating';

const ReviewItem = ({ review, user }) => {
    const { content, created_at, rating } = review || {};

    return (
        <div className="tp-product-details-review-avater d-flex align-items-start">
            <div className="tp-product-details-review-avater-thumb">
                {!user?.google_profile_image && <h5 className="review-name">{user?.first_name.charAt(0)}</h5>}
                <a href="#">
                    {user?.google_profile_image && <Image src={user?.google_profile_image} alt="user img" width={60} height={60} />}
                </a>
            </div>

            <div className="tp-product-details-review-avater-content">
                <div className="tp-product-details-review-avater-rating d-flex align-items-center">
                    <Rating allowFraction size={16} initialValue={rating} readonly={true} />
                </div>

                <h3 className="tp-product-details-review-avater-title">{`${user?.first_name} ${user?.last_name}`}</h3>

                <span className="tp-product-details-review-avater-meta">{dayjs(created_at).format('MMMM D, YYYY')}</span>

                <div className="tp-product-details-review-avater-comment">
                    <p>{content}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;
