import { Badge, Box, Icon, SimpleGrid } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { AiOutlineTruck, AiOutlineDollar } from 'react-icons/ai';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import MiniStatistics from '../../components/cards/MiniStatistics';
import TitleCard from '../../components/cards/TitleCard';
import IconBox from '../../components/icons/IconBox';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { ORDER_STATUS } from '../../../helper/constants/GlobalConstantUtil';
import { useGetListOrder } from '../../../modules/services/OrderService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function PSIReportTable() {
  // #region Variables
  const [searchText, setSearchText] = useState('');

  const [highestOrderPaid, setHighestOrderPaid] = useState({});
  const [lowestOrderPaid, setLowestOrderPaid] = useState({});

  const [totalOrderDelivered, setTotalOrderDelivered] = useState(0);
  const [totalOrderPending, setTotalOrderPending] = useState(0);
  const [totalOrderCancelled, setTotalOrderCancelled] = useState(0);
  const [totalOrderPaid, setTotalOrderPaid] = useState(0);

  const [order, setOrders] = useState([[]]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listOrderData, isFetching: isOrderFetching, isLoading: isOrderLoading } = useGetListOrder();

  useEffect(() => {
    const orders = listOrderData?.data?.flat().filter(Boolean) ?? [];
    setOrders(orders.length > 0 ? orders : []);

    let highestOrderPaid = {};
    let lowestOrderPaid = {};
    let totalOrderDelivered = 0;
    let totalOrderPending = 0;
    let totalOrderCancelled = 0;
    let totalOrderPaid = 0;

    orders.forEach(order => {
      // Initialize highest and lowest order paid
      if (!highestOrderPaid.order_total_price || order.order_total_price > highestOrderPaid.order_total_price) {
        highestOrderPaid = order;
      }
      if (!lowestOrderPaid.order_total_price || order.order_total_price < lowestOrderPaid.order_total_price) {
        lowestOrderPaid = order;
      }

      // Count orders by status
      switch (order.order_status_id) {
        case 1:
          totalOrderPending++;
          break;
        case 2:
          totalOrderPaid++;
          break;
        case 3:
          totalOrderCancelled++;
          break;
        case 4:
          totalOrderDelivered++;
          break;
        default:
          break;
      }
    });

    setHighestOrderPaid(highestOrderPaid);
    setLowestOrderPaid(lowestOrderPaid);
    setTotalOrderDelivered(totalOrderDelivered);
    setTotalOrderPending(totalOrderPending);
    setTotalOrderCancelled(totalOrderCancelled);
    setTotalOrderPaid(totalOrderPaid);
  }, [listOrderData]);
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredOrders(order);
  }, [order]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredOrders(e => e.filter(t => t.product_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
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
  if (isOrderFetching || isOrderLoading || isOrderFetching || isOrderLoading) return <LoadingSpinner />;
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }} gap="24px" mb="24px" mt="2px">
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineTruck} color={`black`} />} />}
          name="Total Order Delivered"
          value={totalOrderDelivered}
        />

        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineTruck} color={`black`} />} />}
          name="Total Order Pending"
          value={totalOrderPending}
        />

        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineTruck} color={`black`} />} />}
          name="Total Order Cancelled"
          value={totalOrderCancelled}
        />

        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineTruck} color={`black`} />} />}
          name="Total Order Paid"
          value={totalOrderPaid}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 2 }} gap="24px" mb="32px" mt="2px">
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineDollar} color={`black`} />} />}
          name="Order with Highest Paid"
          value={`Order #${highestOrderPaid.shop_order_id}`}
        />

        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineDollar} color={`black`} />} />}
          name="Order with Lowest Paid"
          value={`Order #${lowestOrderPaid.shop_order_id}`}
        />
      </SimpleGrid>

      <TitleCard title={`PSI Table`} TopSideButtons={<DynamicTopSide setSearchText={setSearchText} />}>
        <Box marginTop="0px !important">
          {filteredOrders && filteredOrders.length > 0 ? (
            <DynamicTable columns={columns} data={filteredOrders} hideAction={true} />
          ) : (
            <Box h="65vh">
              <NoDataToDisplay />
            </Box>
          )}
        </Box>
      </TitleCard>
    </Box>
  );
  // #endregion
}

export default PSIReportTable;
