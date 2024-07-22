import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import ProductDescription from '../../../common/features/products/ProductDescription';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Product Description' }));
  }, [dispatch]);

  return <ProductDescription />;
}

export default InternalPage;
