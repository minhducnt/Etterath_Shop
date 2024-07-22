import { Badge, Box } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AiOutlineEye } from 'react-icons/ai';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { ORDER_STATUS } from '../../../helper/constants/GlobalConstantUtil';
import { useGetListOrderByUserId } from '../../../modules/services/OrderService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function AccountOrderTable() {
  // #region Variables
  const navigation = useNavigate();
  const { accountId } = useParams();

  const [accountOrders, setAccountOrders] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState({});
  // #endregion

  // #region Hooks
  const { data: listAccountData, isFetching, isLoading } = useGetListOrderByUserId(accountId);

  useEffect(() => {
    // Handle get selected account
    const account = JSON.parse(localStorage.getItem('selectedAccount'));
    if (account) setSelectedAccount(account);

    // Handle account data
    const accounts = listAccountData?.data?.flat().filter(account => account !== null) ?? [];
    setAccountOrders(accounts.length > 0 ? accounts : []);
  }, [listAccountData, setSelectedAccount]);
  // #endregion

  // #region Methods
  const viewItems = useCallback(
    row => {
      localStorage.setItem('selectedOrder', JSON.stringify(row));
      navigation(`/app/orders/${row.shop_order_id}/items`);
    },
    [navigation]
  );

  const viewAddress = useCallback(
    row => {
      localStorage.setItem('selectedOrder', JSON.stringify(row));
      navigation(`/app/orders/${row.shop_order_id}/details`);
    },
    [navigation]
  );
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'View Items',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewItems,
      isDisabled: true
    },
    {
      actionName: 'View Details',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewAddress,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'User Id',
        accessor: 'user_id',
        hidden: true
      },
      {
        Header: 'Order',
        accessor: 'shop_order_id',
        hidden: false
      },
      {
        Header: 'Date',
        accessor: 'order_date',
        haveFilter: {
          filterType: FilterType.DateTime
        },
        haveSort: true,
        type: 'dateTime',
        cellWidth: '120px',
        headerWidth: '120px'
      },
      {
        Header: 'Payment Method Id',
        accessor: 'payment_method_id',
        hidden: true
      },
      {
        Header: 'Payment Method',
        accessor: 'payment_method_name',

        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Status',
        accessor: 'order_status',
        Cell: ({ value }) => (
          <Badge variant="outline" p="5px" colorScheme={Helper.matchingCodeColor(value, ORDER_STATUS)} fontSize="md">
            {value}
          </Badge>
        )
      },
      {
        Header: 'Address Id',
        accessor: 'address_id',
        hidden: true
      },
      {
        Header: 'Total Price',
        accessor: 'order_total_price',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        cellWidth: '160px',
        headerWidth: '160px',
        headerAlign: 'end',
        textAlign: 'end'
      },
      {
        Header: 'Discount Price',
        accessor: 'discount',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        type: 'percent',
        cellWidth: '160px',
        headerWidth: '160px',
        headerAlign: 'end',
        textAlign: 'end'
      },
      {
        Header: 'Order Status Id',
        accessor: 'order_status_id',
        hidden: true
      }
    ],
    []
  );
  // #endregion

  // #region UI
  if (isLoading || isFetching) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`${selectedAccount.first_name} ${selectedAccount.last_name}'s Orders`}
      TopSideButtons={<DynamicTopSide showGoBack={true} type={`account`} />}
    >
      <Box marginTop="0px !important">
        {accountOrders && accountOrders?.length > 0 ? (
          <DynamicTable columns={columns} data={accountOrders} tableRowAction={tableRowAction} hideAction={false} />
        ) : (
          <Box h="65vh">
            <NoDataToDisplay />
          </Box>
        )}
      </Box>
    </TitleCard>
  );
  // #endregion
}

export default AccountOrderTable;
