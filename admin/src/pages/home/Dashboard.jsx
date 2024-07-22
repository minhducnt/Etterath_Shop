import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setPageTitle } from '../../modules/store/common/HeaderSlice';
import Dashboard from '../../common/features/dashboard/Dashboard';

function InternalPage() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setPageTitle({ title: 'Dashboard' }));
	}, [dispatch]);

	return <Dashboard />;
}

export default InternalPage;
