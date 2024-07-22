import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import { setPageTitle } from '../../../modules/store/common/HeaderSlice';
import ProductDetails from '../../../common/features/products/ProductDetails';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Product Details' }));
  }, [dispatch]);

  return <ProductDetails />;
}

export default InternalPage;
