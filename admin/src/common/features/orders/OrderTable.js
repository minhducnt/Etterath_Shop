import { Box, Badge } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { AiOutlineEye } from 'react-icons/ai';

import { useNavigate } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { ORDER_STATUS } from '../../../helper/constants/GlobalConstantUtil';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { orderService, useGetListOrder, useGetListOrderStatus } from '../../../modules/services/OrderService';

function OrderTable() {
  // #region Variables
  const navigation = useNavigate();

  const [order, setOrders] = useState([[]]);
  // #endregion

  // #region Hooks
  const { data: listOrderData, isFetching, isLoading } = useGetListOrder();
  const { data: listOrderStatusData } = useGetListOrderStatus();

  const useUpdateOrder = useDynamicService(orderService.updateOrderStatus, 'listOrder');

  useEffect(() => {
    const orders = listOrderData?.data?.flat().filter(Boolean) ?? [];
    setOrders(orders.length > 0 ? orders : []);
  }, [listOrderData, listOrderStatusData?.data]);
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
        textAlign: 'end',

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
  if (useUpdateOrder.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard title={`Order Management`}>
      <Box marginTop="0px !important">
        {order && order.length > 0 ? (
          <DynamicTable columns={columns} data={order} tableRowAction={tableRowAction} hideAction={false} />
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

export default OrderTable;
