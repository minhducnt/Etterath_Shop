import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import PSIReportTable from '../../../common/features/reports/PSIReports';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'PSI Reports' }));
  }, [dispatch]);

  return <PSIReportTable />;
}

export default InternalPage;
