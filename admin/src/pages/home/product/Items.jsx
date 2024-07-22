import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import ProductItemTable from '../../../common/features/products/ProductItemTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Items' }));
  }, [dispatch]);

  return <ProductItemTable />;
}

export default InternalPage;
