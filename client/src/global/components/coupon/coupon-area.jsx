import React, { useState, useEffect } from 'react';
// internal
import CouponItem from './coupon-item';
import { useGetOfferCouponsQuery } from '@/redux/features/coupon/couponApi';
import CouponLoader from '../loader/coupon-loader';
import ErrorView from '../error/error-view';
import EmptyCoupon from '../error/empty-coupons';
import Pagination from '@/global/utils/ui/pagination';

const CouponArea = () => {
    const [copiedCode, setCopiedCode] = useState('');
    const [copied, setCopied] = useState(false);

    const [coupons, setCoupons] = useState([]);
    const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();

    const [currPage, setCurrPage] = useState(1);
    const [filteredRows, setFilteredRows] = useState(coupons);
    const [pageStart, setPageStart] = useState(0);
    const [countOfPage, setCountOfPage] = useState(10);

    const paginatedData = (items, startPage, pageCount) => {
        setFilteredRows(items);
        setPageStart(startPage);
        setCountOfPage(pageCount);
    };

    const handleCopied = code => {
        setCopiedCode(code);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    useEffect(() => {
        const coupons = offerCoupons?.data?.flat().filter(Boolean) ?? [];
        setCoupons(coupons.length > 0 ? coupons : []);
    }, [offerCoupons]);

    let content = null;

    if (isLoading) {
        content = <CouponLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorView />;
    }
    if (!isLoading && !isError && coupons?.length === 0) {
        content = <EmptyCoupon />;
    }
    if (!isLoading && !isError && coupons?.length > 0) {
        content = coupons?.map(coupon => (
            <div key={coupon.coupon_id} className="col-xl-6">
                <CouponItem coupon={coupon} handleCopied={handleCopied} copied={copied} copiedCode={copiedCode} />
            </div>
        ));
    }
    return (
        <>
            <div className="tp-coupon-area pb-120">
                <div className="container">
                    <div className="row">{content}</div>

                    {coupons.length > 0 && (
                        <div className="tp-shop-pagination mt-20 d-flex justify-content-center">
                            <div className="tp-pagination">
                                <Pagination
                                    items={coupons}
                                    countOfPage={10}
                                    paginatedData={paginatedData}
                                    currPage={currPage}
                                    setCurrPage={setCurrPage}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CouponArea;
