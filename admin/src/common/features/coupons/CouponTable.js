import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineEdit, AiOutlineTag } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { couponService, useGetListCoupon } from '../../../modules/services/CouponService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function CouponTable() {
  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [switchStatusData, setSwitchStatusData] = useState({});

  const [coupon, setCoupons] = useState([[]]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  // #region Hooks
  const { data: listCouponData, isFetching: isFetchingListCoupon, isLoading: isLoadingListCoupon } = useGetListCoupon();
  const { isOpen: isSwitchStatusOpen, onOpen: onSwitchStatusOpen, onClose: onSwitchStatusClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateCoupon = useDynamicService(couponService.createCoupon, 'listCoupon', true);
  const useUpdateCoupon = useDynamicService(couponService.updateCoupon, 'listCoupon', true);

  useEffect(() => {
    const coupons = listCouponData?.data?.flat().filter(Boolean) ?? [];
    setCoupons(coupons.length > 0 ? coupons : []);
    setFilteredCoupons(coupons.length > 0 ? coupons : []);
  }, [listCouponData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleEditCoupon = useCallback(
    values => {
      useUpdateCoupon.mutate({
        ...values,
        coupon_id: editData.coupon_id,
        exp: values.coupon_name,
        block_status: Boolean(values.block_status)
      });
      closeDrawer();
    },
    [editData.coupon_id, useUpdateCoupon, closeDrawer]
  );

  const handleCreateCoupon = useCallback(
    values => {
      useCreateCoupon.mutate(values);
      closeDrawer();
    },
    [useCreateCoupon, closeDrawer]
  );

  const editCoupon = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const switchStatusAccount = row => {
    setSwitchStatusData(row);
    onSwitchStatusOpen();
  };

  const handleSwitchStatus = () => {
    useUpdateCoupon.mutate({
      coupon_id: switchStatusData.coupon_id,
      coupon_name: switchStatusData.coupon_name,
      description: switchStatusData.description,
      expire_date: switchStatusData.expire_date,
      discount_rate: switchStatusData.discount_rate,
      minimum_cart_price: switchStatusData.minimum_cart_price,
      image: switchStatusData.image,
      block_status: !switchStatusData.block_status
    });
    setSwitchStatusData({});
    onSwitchStatusClose();
  };
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredCoupons(coupon);
  }, [coupon]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredCoupons(coupons => coupons.filter(coupon => coupon.coupon_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editCoupon,
      isDisabled: false
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'coupon_id',
        hidden: true
      },
      {
        Header: 'Image',
        accessor: 'image'
      },
      {
        Header: 'Coupon',
        accessor: 'coupon_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Code',
        accessor: 'coupon_code',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Expiry',
        accessor: 'expire_date',
        haveFilter: {
          filterType: FilterType.DateTime
        },
        haveSort: true,

        type: 'dateTime'
      },
      {
        Header: 'Discount',
        accessor: 'discount_rate',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        type: 'percent'
      },
      {
        Header: 'Min Price',
        accessor: 'minimum_cart_price',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true
      },
      {
        Header: 'Blocked',
        accessor: 'block_status',
        headerAlign: 'center',
        textAlign: 'center',
        isIcon: true
      },
      {
        Header: 'Description',
        accessor: 'description',
        hidden: true
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'coupon_name',
      label: 'Coupon',
      placeholder: 'SUMMER_SALE20, etc.',
      isRequired: true,
      leftIcon: <AiOutlineTag color="#999" fontSize="1.05rem" />
    },
    {
      name: 'coupon_code',
      label: 'Code',
      isReadOnly: true,
      leftIcon: <AiOutlineTag color="#999" fontSize="1.05rem" />,
      hidden: !editData?.coupon_code ? true : false
    },
    {
      name: 'image',
      label: 'Image',
      isImgUpload: true,
      isRequired: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Enter your description',
      isTextAreaField: true
    },
    {
      name: 'expire_date',
      label: 'Expire Date',
      isRequired: true,
      isDateField: true
    },
    {
      name: 'discount_rate',
      label: 'Discount (%)',
      placeholder: 'Enter the rate',
      isRequired: true,
      isNumber: true
    },
    {
      name: 'minimum_cart_price',
      label: 'Min Cart Price',
      isRequired: true,
      isCurrency: true
    }
  ];

  const initialValues = {
    coupon_name: `${editData?.coupon_name ?? ''}`,
    coupon_code: `${editData?.coupon_code ?? ''}`,
    description: `${editData?.description ?? ' '}`,
    expire_date: `${
      editData?.expire_date
        ? new Date(new Date(editData?.expire_date).setDate(new Date(editData?.expire_date).getDate() + 7)).toISOString().substring(0, 10)
        : new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().substring(0, 10)
    }`,
    discount_rate: `${editData?.discount_rate ?? 0}`,
    minimum_cart_price: `${editData?.minimum_cart_price ?? 0}`,
    image: `${editData?.image ?? ''}`,
    block_status: `${editData?.block_status ?? false}`
  };

  const validationSchema = Yup.object().shape({
    coupon_name: Yup.string()
      .required('This field is required')
      .min(0, 'Must be between 0 and 25 characters')
      .max(25, 'Must be between 0 and 25 characters'),
    description: Yup.string().min(6, 'Must be between 6 and 100.000 characters').max(100000, 'Must be between 6 and 100.000 characters'),
    expire_date: Yup.date()
      .required('This field is required')
      .test('is-expired', 'The coupon has expired', function (value) {
        const today = new Date();
        return value >= today;
      }),
    discount_rate: Yup.number()
      .required('This field is required')
      .min(1, 'Discount rate must be greater than 0')
      .max(100, 'Discount rate must be less than 100'),
    minimum_cart_price: Yup.number().required('This field is required').min(1, 'Minimum cart price must be greater than 0')
  });
  // #endregion

  // #region UI
  if (isLoadingListCoupon || isFetchingListCoupon) return <LoadingSpinner />;
  if (useUpdateCoupon.isLoading || useCreateCoupon.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Coupon Management`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={onAddEditOpen} allowAddNew={true} />}
    >
      <Box marginTop="0px !important">
        {filteredCoupons && filteredCoupons.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            handleSwitchStatus={switchStatusAccount}
            columns={columns}
            data={filteredCoupons}
            tableRowAction={tableRowAction}
            hideAction={false}
          />
        ) : (
          <Box h="65vh">
            <NoDataToDisplay />
          </Box>
        )}
      </Box>
      <DynamicDrawer
        handleEdit={handleEditCoupon}
        handleCreate={handleCreateCoupon}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
      />
      <ChakraAlertDialog
        isOpen={isSwitchStatusOpen}
        onClose={onSwitchStatusClose}
        onAccept={handleSwitchStatus}
        acceptButtonColor="green"
        acceptButtonLabel={`Confirm`}
        message={`Are you sure you want to ${switchStatusData?.active === true ? 'block' : 'unblock'} this coupon method?`}
        title={`${switchStatusData?.active === true ? 'Block' : 'Unblock'} this coupon method`}
      />
    </TitleCard>
  );
  // #endregion
}

export default CouponTable;
