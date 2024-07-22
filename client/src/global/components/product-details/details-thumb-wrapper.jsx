import Image from 'next/image';

import onErrorItem from '@assets/img/error/onErrorItem.svg';

const DetailsThumbWrapper = ({ imageURLs, handleImageActive, activeImg, imgWidth = 416, imgHeight = 480, qty_in_stock }) => {
    return (
        <>
            <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
                <nav>
                    <div className="nav nav-tabs flex-sm-column">
                        {imageURLs?.map((item, i) => (
                            <button key={i} className={`nav-link active`} onClick={() => handleImageActive(item)}>
                                <Image
                                    src={item || onErrorItem}
                                    fallback={onErrorItem}
                                    alt="product-variation"
                                    width={70}
                                    height={100}
                                    sizes="100vw"
                                    style={{
                                        display: 'block',
                                        margin: '0 auto',
                                        objectFit: 'contain',
                                        background: 'white',
                                        width: '70px',
                                        height: '100px'
                                    }}
                                    as="variation-image"
                                    priority
                                />
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="tab-content m-img">
                    <div className="tab-pane fade show active">
                        <div className="tp-product-details-nav-main-thumb p-relative">
                            <Image
                                src={activeImg || onErrorItem}
                                fallback={onErrorItem}
                                alt="product-image"
                                width={imgWidth}
                                height={imgHeight}
                                sizes="100vw"
                                style={{
                                    display: 'block',
                                    margin: '0 auto',
                                    objectFit: 'contain',
                                    background: 'white',
                                    width: '500px',
                                    height: '500px'
                                }}
                                as="active-image"
                                priority
                            />
                            <div className="tp-product-badge">{qty_in_stock === 0 && <span className="product-hot">out-stock</span>}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailsThumbWrapper;
