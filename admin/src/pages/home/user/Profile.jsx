import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import { setPageTitle } from '../../../modules/store/common/HeaderSlice';
import ProfileSettings from '../../../common/features/settings/profile/ProfileSettings';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Profile' }));
  }, [dispatch]);

  return <ProfileSettings />;
}

export default InternalPage;
