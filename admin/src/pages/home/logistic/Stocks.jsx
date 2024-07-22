import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import StockTable from '../../../common/features/stocks/StockTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Stocks' }));
  }, [dispatch]);

  return <StockTable />;
}

export default InternalPage;
