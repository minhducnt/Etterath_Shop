import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import { setPageTitle } from '../../../modules/store/common/HeaderSlice';
import PasswordSettings from '../../../common/features/settings/password/PasswordSettings';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Privacy' }));
  }, [dispatch]);

  return <PasswordSettings />;
}

export default InternalPage;
