import { Box, Icon, SimpleGrid } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { AiOutlineProduct, AiOutlineDollarCircle } from 'react-icons/ai';
import { BsBoxSeam, BsBoxSeamFill } from 'react-icons/bs';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import MiniStatistics from '../../components/cards/MiniStatistics';
import TitleCard from '../../components/cards/TitleCard';
import IconBox from '../../components/icons/IconBox';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useGetListStock } from '../../../modules/services/StockService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

import ReportTopBar from './ReportTopBar';

function PnLReportTable() {
  // #region Variables
  const [searchText, setSearchText] = useState('');

  const [topModelProfit, setTopModelProfit] = useState({});
  const [lowestModelProfit, setLowestModelProfit] = useState({});
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalQtyInStock, setTotalQtyInStock] = useState(0);
  const [totalQtyOutStock, setTotalQtyOutStock] = useState(0);

  const [stock, setStocks] = useState([[]]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listStockData, isFetching: isStockFetching, isLoading: isStockLoading } = useGetListStock();

  useEffect(() => {
    const stocks = listStockData?.data?.flat().filter(Boolean) ?? [];
    setStocks(stocks.length > 0 ? stocks : []);
    // setFilteredStocks(stocks.length > 0 ? stocks : []);

    let totalProfit = 0;
    let totalQtyInStock = 0;
    let totalQtyOutStock = 0;
    let totalCost = 0;

    const stocksWithProfit = stocks.map(stock => {
      totalQtyInStock += stock.qty_in_stock;
      totalQtyOutStock += stock.qty_out_stock;

      let discount = stock.discount_price === 0 ? stock.price : stock.discount_price;
      stock.discount_price = discount;

      const profit = discount * stock.qty_out_stock - stock.puscharge_price * (stock.qty_in_stock + stock.qty_out_stock);
      totalProfit += profit;

      const cost = stock.puscharge_price * stock.qty_in_stock;
      totalCost += stock.puscharge_price * stock.qty_in_stock;

      return { ...stock, profit, cost };
    });

    setTotalProfit(totalProfit);
    setTotalQtyInStock(totalQtyInStock);
    setTotalQtyOutStock(totalQtyOutStock);
    setTotalCost(totalCost);

    const sortedData = stocksWithProfit.sort((a, b) => b.profit - a.profit);
    setStocks(sortedData);
    setFilteredStocks(sortedData);

    const topModelName = sortedData.length > 0 ? sortedData[0] : 'No models available';
    setTopModelProfit(topModelName);

    const lowestModelProfit = sortedData.length > 0 ? sortedData[sortedData.length - 1] : 'No models available';
    setLowestModelProfit(lowestModelProfit);
  }, [listStockData]);
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredStocks(stock);
  }, [stock]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredStocks(e => e.filter(t => t.product_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'product_item_id',
        hidden: true
      },
      {
        Header: 'Product',
        accessor: 'product_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        cellWidth: '300px',
        headerWidth: '300px'
      },
      {
        Header: 'SKU',
        accessor: 'sku',
        hidden: true
      },
      {
        Header: 'Qty in Stock',
        accessor: 'qty_in_stock',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        headerAlign: 'center',
        textAlign: 'center',
        cellWidth: '150px',
        headerWidth: '150px'
      },
      {
        Header: 'Qty Out Stock',
        accessor: 'qty_out_stock',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        headerAlign: 'center',
        textAlign: 'center',
        cellWidth: '150px',
        headerWidth: '150px'
      },
      {
        Header: 'Price',
        accessor: 'price',
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
        Header: 'Purch. Price',
        accessor: 'puscharge_price',
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
        Header: 'Disc. Price',
        accessor: 'discount_price',
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
        Header: 'Profit',
        accessor: 'profit',
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
        Header: 'Cost',
        accessor: 'cost',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        cellWidth: '160px',
        headerWidth: '160px',
        headerAlign: 'end',
        textAlign: 'end'
      }
    ],
    []
  );
  // #endregion

  // #region UI
  if (isStockFetching || isStockLoading) return <LoadingSpinner />;
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }} gap="24px" mb="24px" mt="2px">
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineDollarCircle} color={`black`} />} />
          }
          name="Total Profit"
          value={Helper.formatCurrency(totalProfit)}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineDollarCircle} color={`black`} />} />
          }
          name="Total Cost"
          value={Helper.formatCurrency(totalCost)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={BsBoxSeam} color={`black`} />} />}
          name="Total Qty In Stock"
          value={totalQtyInStock}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={BsBoxSeamFill} color={`black`} />} />}
          name="Total Qty Out Stock"
          value={totalQtyOutStock}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 2 }} gap="20px" mb="24px">
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineProduct} color={`black`} />} />}
          name="Product with Highest Profit"
          value={topModelProfit?.product_name?.slice(0, 48) + '...'}
          linkTo={`models/${topModelProfit?.product_item_id}`}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineProduct} color={`black`} />} />}
          name="Product with Lowest Profit"
          value={lowestModelProfit?.product_name?.slice(0, 48) + '...'}
          linkTo={`models/${lowestModelProfit?.product_item_id}`}
        />
      </SimpleGrid>

      <ReportTopBar />

      <TitleCard title={`PnL Table`} TopSideButtons={<DynamicTopSide setSearchText={setSearchText} />}>
        <Box marginTop="0px !important">
          {filteredStocks && filteredStocks.length > 0 ? (
            <DynamicTable columns={columns} data={filteredStocks} hideAction={true} />
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

export default PnLReportTable;
