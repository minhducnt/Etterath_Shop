import React, { useRef, useEffect, use, useState } from 'react';
import { useSelector } from 'react-redux';
// internal
import ReviewForm from '../forms/review-form';
import ReviewItem from './review-item';
import Loader from '../loader/loader';

const DetailsTabNav = ({ product, reviews }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState([{}]);

    const { product_id, description, properties } = product || {};

    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const activeRef = useRef(null);
    const marker = useRef(null);

    const handleActive = e => {
        if (e.target.classList.contains('active')) {
            marker.current.style.left = e.target.offsetLeft + 'px';
            marker.current.style.width = e.target.offsetWidth + 'px';
        }
    };

    useEffect(() => {
        if (activeRef.current?.classList.contains('active')) {
            marker.current.style.left = activeRef.current.offsetLeft + 'px';
            marker.current.style.width = activeRef.current.offsetWidth + 'px';
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);

        let parsedProperties = [];
        if (properties.trim() !== '' && properties !== null) {
            parsedProperties = JSON.parse(properties);
        } else {
            parsedProperties = [];
        }

        setAdditionalInfo(parsedProperties);

        setIsLoading(false);
    }, [properties]);

    // nav item
    function NavItem({ active = false, id, title, linkRef }) {
        return (
            <button
                ref={linkRef}
                className={`nav-link ${active ? 'active' : ''}`}
                id={`nav-${id}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#nav-${id}`}
                type="button"
                role="tab"
                aria-controls={`nav-${id}`}
                aria-selected={active ? 'true' : 'false'}
                tabIndex="-1"
                onClick={e => handleActive(e)}
            >
                {title}
            </button>
        );
    }

    if (isLoading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <Loader spinner="fade" loading={isLoading} />
            </div>
        );
    }

    return (
        <>
            <div className="tp-product-details-tab-nav tp-tab">
                <nav>
                    <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" id="navPresentationTab" role="tablist">
                        <NavItem active={true} linkRef={activeRef} id="desc" title="Overview" />
                        <NavItem id="additional" title="Specs" />
                        <NavItem id="review" title={`Reviews (${reviews.length})`} />

                        <span ref={marker} id="productTabMarker" className="tp-product-details-tab-line"></span>
                    </div>
                </nav>
                <div className="tab-content" id="navPresentationTabContent">
                    {/* Additional Info */}
                    <div className="tab-pane fade" id="nav-additional" role="tabpanel" aria-labelledby="nav-additional-tab" tabIndex="-1">
                        <div className="tp-product-details-additional-info">
                            <div className="row justify-content-center">
                                <div className="col-xl-10">
                                    {additionalInfo && additionalInfo.length > 0 ? (
                                        <table>
                                            <tbody>
                                                {additionalInfo.map((item, i) => (
                                                    <tr key={i}>
                                                        <td>{item.key}</td>
                                                        <td>{item.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No specs available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="tab-pane fade show active" id="nav-desc" role="tabpanel" aria-labelledby="nav-desc-tab" tabIndex="-1">
                        <div className="tp-product-details-desc-wrapper pt-50">
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="tp-product-details-desc-item">
                                        <div className="row align-items-center">
                                            <div className="col-lg-12">
                                                <div className="tp-product-details-desc-content">
                                                    <div dangerouslySetInnerHTML={{ __html: description }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="tab-pane fade" id="nav-review" role="tabpanel" aria-labelledby="nav-review-tab" tabIndex="-1">
                        <div className="tp-product-details-review-wrapper pt-60">
                            <div className="row">
                                <div className="tp-product-details-review-statics">
                                    <div className="tp-product-details-review-list pr-110">
                                        <h3 className="tp-product-details-review-title">Reviews</h3>
                                        {reviews.length === 0 && (
                                            <h3 className="tp-product-details-review-title">There are no reviews yet.</h3>
                                        )}
                                        {reviews.length > 0 && (
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                                    gap: '20px',
                                                    alignItems: 'start'
                                                }}
                                            >
                                                {reviews.map(item => (
                                                    <ReviewItem key={item.id} review={item} user={item.user} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailsTabNav;
