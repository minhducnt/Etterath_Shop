import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import VariantTable from '../../../common/features/categories/VariantTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Category Variants' }));
  }, [dispatch]);

  return <VariantTable />;
}

export default InternalPage;
