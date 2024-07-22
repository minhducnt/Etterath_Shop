import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineEdit, AiOutlineBarcode } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { stockService, useGetListStock } from '../../../modules/services/StockService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function StockTable() {
  // #region Variables
  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});

  const [stock, setStocks] = useState([[]]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listStockData, isFetching, isLoading } = useGetListStock();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useUpdateStock = useDynamicService(stockService.updateStock, 'listStock');

  useEffect(() => {
    const stocks = listStockData?.data?.flat().filter(Boolean) ?? [];
    setStocks(stocks.length > 0 ? stocks : []);
    setFilteredStocks(stocks.length > 0 ? stocks : []);
  }, [listStockData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleEditStock = useCallback(
    values => {
      useUpdateStock.mutate(values);
      closeDrawer();
    },
    [useUpdateStock, closeDrawer]
  );

  const editStock = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );
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
  const tableRowAction = [
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editStock,
      isDisabled: true
    }
  ];

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
        cellWidth: '400px',
        headerWidth: '400px'
      },
      {
        Header: 'SKU',
        accessor: 'sku'
      },
      {
        Header: 'Qty in Stock',
        accessor: 'qty_in_stock',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        headerAlign: 'center',
        textAlign: 'center'
      },
      {
        Header: 'Qty Out Stock',
        accessor: 'qty_out_stock',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        headerAlign: 'center',
        textAlign: 'center'
      },
      {
        Header: 'Variant Options',
        accessor: '-',
        cellWidth: '150px',
        hidden: true
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'sku',
      label: 'SKU',
      leftIcon: <AiOutlineBarcode className={`h-5 w-5`} />,
      isReadOnly: true
    },
    {
      name: 'qty_to_add',
      label: 'Quantity to Add',
      isNumber: true
    },
    {
      name: 'qty_to_remove',
      label: 'Quantity to Remove',
      isNumber: true,
      hidden: true
    }
  ];

  const initialValues = {
    sku: `${editData?.sku ?? ''}`,
    qty_to_add: `${0}`,
    qty_to_remove: `${editData?.qty_to_remove ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    qty_to_add: Yup.number().min(0, 'Quantity to add cannot be negative').typeError('This field must be a number'),
    qty_to_remove: Yup.number().min(0, 'Quantity to remove cannot be negative').typeError('This field must be a number')
  });
  // #endregion

  // #region UI
  if (isFetching || isLoading) return <LoadingSpinner />;
  if (useUpdateStock.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard title={`Stock Management`} TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={onAddEditOpen} />}>
      <Box marginTop="0px !important">
        {filteredStocks && filteredStocks.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredStocks}
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
        handleEdit={handleEditStock}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
      />
    </TitleCard>
  );
  // #endregion
}

export default StockTable;
