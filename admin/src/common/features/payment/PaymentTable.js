import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineCreditCard, AiOutlineEdit } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { paymentService, useGetListPaymentMethod } from '../../../modules/services/PaymentService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function PaymentTable() {
  // #region Variables
  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [switchStatusData, setSwitchStatusData] = useState({});

  const [payment, setPayments] = useState([[]]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listPaymentData, isFetching, isLoading } = useGetListPaymentMethod();
  const { isOpen: isSwitchStatusOpen, onOpen: onSwitchStatusOpen, onClose: onSwitchStatusClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useUpdatePayment = useDynamicService(paymentService.updatePaymentMethod, 'listPayment');

  useEffect(() => {
    const payments = listPaymentData?.data?.flat() ?? [];
    setPayments(payments.length > 0 ? payments : []);
    setFilteredPayments(payments.length > 0 ? payments : []);
  }, [listPaymentData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleEditPayment = useCallback(
    values => {
      const paymentObj = { id: editData.id, ...values };
      useUpdatePayment.mutate(paymentObj);
      closeDrawer();
    },
    [editData.id, useUpdatePayment, closeDrawer]
  );

  const editPayment = useCallback(
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
    useUpdatePayment.mutate({
      id: switchStatusData.id,
      block_status: !switchStatusData.block_status,
      maximum_amount: switchStatusData.maximum_amount
    });
    setSwitchStatusData({});
    onSwitchStatusClose();
  };
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredPayments(payment);
  }, [payment]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredPayments(e => e.filter(t => t.name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    if (searchText === '') {
      removeFilter();
    } else {
      applySearch(searchText);
    }
  }, [searchText, removeFilter, applySearch]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editPayment,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
        hidden: true
      },
      {
        Header: 'Payment',
        accessor: 'name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        textAlign: 'start'
      },
      {
        Header: 'Max Amount',
        accessor: 'maximum_amount',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        headerWidth: '350px',
        cellWidth: '350px'
      },
      {
        Header: 'Blocked',
        accessor: 'block_status',
        textAlign: 'center',
        headerAlign: 'center'
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerFieldData = [
    {
      name: 'name',
      label: 'Payment',
      placeholder: 'Payment',
      isRequired: true,
      isReadOnly: true,
      leftIcon: <AiOutlineCreditCard color="#999" fontSize="1.05rem" />
    },
    {
      name: 'maximum_amount',
      label: 'Max Amount',
      isRequired: true,
      isCurrency: true
    }
  ];

  const initialValues = {
    name: `${editData?.name ?? ''}`,
    maximum_amount: `${editData?.maximum_amount ?? 0}`,
    block_status: `${editData?.block_status ?? false}`
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('This field is required'),
    maximum_amount: Yup.number('This field must be a number')
      .required('This field is required')
      .min(1, 'Must be between 1 and 1.000.000.000.000')
      .max(1000000000, 'Must be between 1 and 1.000.000.000.000')
  });
  // #endregion

  // #region UI
  if (isLoading || isFetching) return <LoadingSpinner />;
  if (useUpdatePayment.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Payment Methods Management`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={onAddEditOpen} />}
    >
      <Box marginTop="0px !important">
        {filteredPayments && filteredPayments.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            handleSwitchStatus={switchStatusAccount}
            columns={columns}
            data={filteredPayments}
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
        handleEdit={handleEditPayment}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerFieldData}
      />
      <ChakraAlertDialog
        isOpen={isSwitchStatusOpen}
        onClose={onSwitchStatusClose}
        onAccept={handleSwitchStatus}
        acceptButtonColor="green"
        acceptButtonLabel={`Confirm`}
        message={`Are you sure you want to ${switchStatusData?.active === true ? 'block' : 'unblock'} this payment method?`}
        title={`${switchStatusData?.active === true ? 'Block' : 'Unblock'} this payment method`}
      />
    </TitleCard>
  );
  // #endregion
}

export default PaymentTable;
