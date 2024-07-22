import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import OfferTable from '../../../common/features/offers/OfferTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Offers' }));
  }, [dispatch]);

  return <OfferTable />;
}

export default InternalPage;
