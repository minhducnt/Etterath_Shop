import React from 'react';

const ShopBreadcrumb = ({ title, subtitle }) => {
    return (
        <>
            <section className="breadcrumb__area include-bg pt-95 pb-50">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="breadcrumb__content p-relative z-index-1">
                                <h3 className="breadcrumb__title pb-2">{title}</h3>
                                <div className="breadcrumb__list">
                                    <span>
                                        <a href="/" style={{ textDecoration: 'none' }}>
                                            Home
                                        </a>
                                    </span>
                                    <span>{subtitle}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopBreadcrumb;
