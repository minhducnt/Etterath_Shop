import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import ProductTable from '../../../common/features/products/ProductTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Products' }));
  }, [dispatch]);

  return <ProductTable />;
}

export default InternalPage;
