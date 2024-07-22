import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import OrderItemTable from '../../../common/features/orders/OrderItemTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Order Items' }));
  }, [dispatch]);

  return <OrderItemTable />;
}

export default InternalPage;
