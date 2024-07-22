import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import PaymentTable from '../../common/features/payment/PaymentTable';
import { setPageTitle } from '../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Payment Methods' }));
  }, [dispatch]);

  return <PaymentTable />;
}

export default InternalPage;
