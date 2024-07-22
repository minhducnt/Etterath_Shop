import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import AccountTable from '../../../common/features/accounts/AccountTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Accounts' }));
  }, [dispatch]);

  return <AccountTable />;
}

export default InternalPage;
