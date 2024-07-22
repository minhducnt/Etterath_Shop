import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import OptionTable from '../../../common/features/categories/OptionTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Options' }));
  }, [dispatch]);

  return <OptionTable />;
}

export default InternalPage;
