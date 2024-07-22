import { useDispatch } from 'react-redux';

import { useEffect } from 'react';

import OfferProductTable from '../../../common/features/offers/OfferProductTable';
import { setPageTitle } from '../../../modules/store/common/HeaderSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Product Offers' }));
  }, [dispatch]);

  return <OfferProductTable />;
}

export default InternalPage;
