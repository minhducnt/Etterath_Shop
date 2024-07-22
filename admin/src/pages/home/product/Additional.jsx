import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import ProductAdditional from '../../../common/features/products/ProductAdditional';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Additional Information' }));
  }, [dispatch]);

  return <ProductAdditional />;
}

export default InternalPage;
