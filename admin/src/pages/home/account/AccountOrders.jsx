import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import AccountOrderTable from '../../../common/features/accounts/AccountOrderTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'User Orders' }));
  }, [dispatch]);

  return <AccountOrderTable />;
}

export default InternalPage;
