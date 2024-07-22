import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import BrandTable from '../../../common/features/brands/BrandTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Brands' }));
  }, [dispatch]);

  return <BrandTable />;
}

export default InternalPage;
