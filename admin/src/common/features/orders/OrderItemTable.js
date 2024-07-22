import { Badge, Box } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { ORDER_STATUS } from '../../../helper/constants/GlobalConstantUtil';
import { useGetListOrderItem } from '../../../modules/services/OrderService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function OrderItemTable() {
  // #region Variables
  const { shopOrderId } = useParams();
  const [searchText, setSearchText] = useState('');

  const [orderItem, setOrderItems] = useState([[]]);
  const [filteredOrderItems, setFilteredOrderItems] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState({});
  // #endregion

  // #region Hooks
  const { data: listOrderItemData, isFetching, isLoading } = useGetListOrderItem(shopOrderId);

  useEffect(() => {
    // Handle get selected order
    const offer = JSON.parse(localStorage.getItem('selectedOrder'));
    if (offer) {
      setSelectedOrder(offer);
    }

    // Handle get list order product
    const orderItems = listOrderItemData?.data?.flat().filter(Boolean) ?? [];
    setOrderItems(orderItems.length > 0 ? orderItems : []);
    setFilteredOrderItems(orderItems.length > 0 ? orderItems : []);
  }, [listOrderItemData]);
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredOrderItems(orderItem);
  }, [orderItem]);

  const applySearch = useCallback(value => {
    const searchValueLower = value.toLowerCase();
    setFilteredOrderItems(orderItems => orderItems.filter(item => item.product_name.toLowerCase().includes(searchValueLower)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const columns = useMemo(
    () => [
      {
        Header: 'Product Item Id',
        accessor: 'product_item_id',
        hidden: true
      },
      {
        Header: 'Product',
        accessor: 'product_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Image',
        accessor: 'image'
      },
      {
        Header: 'Price',
        accessor: 'price',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true
      },
      {
        Header: 'Qty',
        accessor: 'qty',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true
      },
      {
        Header: 'Sub Total',
        accessor: 'sub_total',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true
      },
      {
        Header: 'Order Date',
        accessor: 'order_date',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        type: 'dateTime'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <Badge variant="outline" p="5px" colorScheme={Helper.matchingCodeColor(value, ORDER_STATUS)} fontSize="md">
            {value}
          </Badge>
        )
      }
    ],
    []
  );
  // #endregion

  // #region UI
  if (isLoading || isFetching) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Order #${selectedOrder.shop_order_id}`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} showGoBack={true} type={`orderProduct`} />}
    >
      <Box marginTop="0px !important">
        {filteredOrderItems && filteredOrderItems.length > 0 ? (
          <DynamicTable columns={columns} data={filteredOrderItems} hideAction={true} />
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

export default OrderItemTable;
