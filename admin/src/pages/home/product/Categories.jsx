import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import CategoryTable from '../../../common/features/categories/CategoryTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Categories' }));
  }, [dispatch]);

  return <CategoryTable />;
}

export default InternalPage;
