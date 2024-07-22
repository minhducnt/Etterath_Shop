import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import SubCategoryTable from '../../../common/features/categories/SubCategoryTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Sub Categories' }));
  }, [dispatch]);

  return <SubCategoryTable />;
}

export default InternalPage;
