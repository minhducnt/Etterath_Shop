import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setPageTitle } from '../../../modules/store/common/HeaderSlice';
import OrderDetails from '../../../common/features/orders/OrderDetails';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Order Details' }));
  }, [dispatch]);

  return <OrderDetails />;
}

export default InternalPage;
