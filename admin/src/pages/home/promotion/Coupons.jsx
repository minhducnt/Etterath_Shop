import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import CouponTable from '../../../common/features/coupons/CouponTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Coupons' }));
  }, [dispatch]);

  return <CouponTable />;
}

export default InternalPage;
