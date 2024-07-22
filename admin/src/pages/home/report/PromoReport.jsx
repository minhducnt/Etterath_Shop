import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import PromoReportTable from '../../../common/features/reports/PromoReports';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Promotion Reports' }));
  }, [dispatch]);

  return <PromoReportTable />;
}

export default InternalPage;
