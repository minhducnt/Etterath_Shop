import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import PnLReportTable from '../../../common/features/reports/PnLReports';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'PnL Reports' }));
  }, [dispatch]);

  return <PnLReportTable />;
}

export default InternalPage;
