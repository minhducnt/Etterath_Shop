import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
// internal
import { handleModalClose } from '@/redux/features/productModalSlice';
import DetailsThumbWrapper from '@/global/components/product-details/details-thumb-wrapper';
import DetailsWrapper from '@/global/components/product-details/details-wrapper';
import { initialOrderQuantity } from '@/redux/features/cart/cartSlice';
import { useGetAllProductItemsQuery } from '@/redux/features/productApi';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: 'calc(100% - 300px)'
    }
};

const ProductModal = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const { productItem, isModalOpen } = useSelector(state => state.productModal);
    const [productDetail, setProductDetail] = useState([{}]);

    const { images, status } = productItem || {};
    const [activeImg, setActiveImg] = useState(images[0]);

    const { data: detailData } = useGetAllProductItemsQuery(productItem.product_id);

    useEffect(() => {
        if (detailData && Array.isArray(detailData.data)) {
            const result = detailData?.data?.flat() ?? [];
            result.length > 0 && result[0] !== null ? setProductDetail(result[0]) : setProductDetail([]);
        } else {
            setProductDetail([{}]);
        }
    }, [detailData]);

    useEffect(() => {
        setActiveImg(images[0]);
        dispatch(initialOrderQuantity());
        setLoading(false);
    }, [images[0], dispatch]);

    const handleImageActive = item => {
        setActiveImg(item);
        setLoading(true);
    };

    return (
        <div>
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => dispatch(handleModalClose())}
                style={customStyles}
                contentLabel="Product Modal"
            >
                <div className="tp-product-modal">
                    <div className="tp-product-modal-content d-lg-flex">
                        <button onClick={() => dispatch(handleModalClose())} type="button" className="tp-product-modal-close-btn">
                            <i className="fa-regular fa-xmark" />
                        </button>

                        <DetailsThumbWrapper
                            activeImg={activeImg}
                            handleImageActive={handleImageActive}
                            imageURLs={images}
                            imgWidth={420}
                            imgHeight={480}
                            loading={loading}
                            qty_in_stock={productDetail.qty_in_stock}
                        />

                        <DetailsWrapper
                            productItem={productItem}
                            productDetail={productDetail}
                            handleImageActive={handleImageActive}
                            activeImg={activeImg}
                            isModal={true}
                        />
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};

export default ProductModal;
