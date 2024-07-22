import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import OrderTable from '../../../common/features/orders/OrderTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Orders' }));
  }, [dispatch]);

  return <OrderTable />;
}

export default InternalPage;
