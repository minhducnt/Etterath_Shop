import React from 'react';
import dayjs from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';
import Image from 'next/image';
// internal
import OfferTimer from './offer-timer';
import { InfoDetails } from '@svgs';
import onErrorItem from '@assets/img/error/onErrorItem.svg';
import { Helper } from '@/global/utils/helpers/misc';

const CouponItem = ({ coupon, handleCopied, copiedCode, copied }) => {
    return (
        <div className="tp-coupon-item mb-30 p-relative d-md-flex justify-content-between align-items-center">
            <span className="tp-coupon-border" />
            <div className="tp-coupon-item-left d-sm-flex align-items-center">
                <div className="tp-coupon-thumb">
                    <a href="#">
                        <Image src={coupon.image} fallback={onErrorItem} alt="coupon" width={120} height={120} />
                    </a>
                </div>

                <div className="tp-coupon-content">
                    <h3 className="tp-coupon-title">{coupon.coupon_name}</h3>

                    <p className="tp-coupon-offer mb-15">
                        <span>{coupon.discount_rate}%</span>Off
                    </p>

                    <div className="tp-coupon-countdown">
                        {dayjs().isAfter(dayjs(coupon.expire_date)) ? (
                            <div className="tp-coupon-countdown-inner">
                                <ul>
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
                            </div>
                        ) : (
                            <OfferTimer expiryTimestamp={new Date(coupon.expire_date)} />
                        )}
                    </div>
                </div>
            </div>
            <div className="tp-coupon-item-right pl-20">
                <div className="tp-coupon-status mb-10 d-flex align-items-center">
                    <h4>
                        Coupon{' '}
                        <span className={dayjs().isAfter(dayjs(coupon.expire_date)) ? 'in-active' : 'active'}>
                            {dayjs().isAfter(dayjs(coupon.expire_date)) ? 'Inactive' : 'Active'}
                        </span>
                    </h4>

                    <div className="tp-coupon-info-details">
                        <span>
                            <InfoDetails />
                        </span>

                        <div className="tp-coupon-info-tooltip transition-3">
                            <p>
                                *This coupon code will apply on the <span>products</span> and when you shopping more than{' '}
                                <span>{Helper.formatCurrency(coupon.minimum_cart_price)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`${coupon.used ? 'tp-coupon-datedisabled' : 'tp-coupon-date'} `}>
                    <CopyToClipboard text={coupon.coupon_code} onCopy={() => handleCopied(coupon.coupon_code)}>
                        <button disabled={coupon.used}>
                            {copied && coupon.coupon_code === copiedCode ? (
                                <span>Copied!</span>
                            ) : coupon.used ? (
                                <span>Coupon Used</span>
                            ) : (
                                <span>{coupon.coupon_code}</span>
                            )}
                        </button>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    );
};

export default CouponItem;
