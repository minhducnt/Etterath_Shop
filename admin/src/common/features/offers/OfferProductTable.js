import { Box, useDisclosure } from '@chakra-ui/react';

import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { offerService, useGetListOfferProduct, useGetListOffer } from '../../../modules/services/OfferService';
import { useGetListProduct } from '../../../modules/services/ProductService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function OfferProductTable() {
  // #region Variables
  const { offerId } = useParams();

  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  const [searchText, setSearchText] = useState('');

  const [offerProduct, setOfferProducts] = useState([[]]);
  const [filteredOfferProducts, setFilteredOfferProducts] = useState([]);

  const [listProductArray, setListProductArray] = useState([[]]);
  const [listOfferArray, setListOfferArray] = useState([[]]);

  const [selectedOffer, setSelectedOffer] = useState({});
  // #endregion

  // #region Hooks
  const {
    data: listOfferProductData,
    isFetching: isFetchingListOfferProduct,
    isLoading: isLoadingListOfferProduct
  } = useGetListOfferProduct(offerId);
  const { data: listProductData, isFetching: isFetchingListProduct, isLoading: isLoadingListProduct } = useGetListProduct();
  const { data: listOfferData, isFetching: isFetchingListOffer, isLoading: isLoadingListOffer } = useGetListOffer();

  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateOfferProduct = useDynamicService(offerService.createOfferProduct, 'listOfferProduct');
  const useDeleteOfferProduct = useDynamicService(offerService.deleteOfferProduct, 'listOfferProduct');
  const useSaveOfferProduct = useDynamicService(offerService.updateOfferProduct, 'listOfferProduct');

  useEffect(() => {
    // Handle get selected offer
    const offer = JSON.parse(localStorage.getItem('selectedOffer'));
    if (offer) {
      setSelectedOffer(offer);
    }

    // Handle product data
    if (listProductData && Array.isArray(listProductData.data)) {
      const products = listProductData.data.flat();
      const productArray =
        products.length > 0 && products[0] !== null ? Helper.convertToArraySelection(products, 'product_name', 'product_id') : [];
      setListProductArray(productArray);
    }

    // Handle offer data
    if (listOfferData && Array.isArray(listOfferData.data)) {
      const offers = listOfferData.data.flat();
      const offerArray = offers.length > 0 && offers[0] !== null ? Helper.convertToArraySelection(offers, 'offer_name', 'id') : [];
      setListOfferArray(offerArray);
    }

    // Handle offer product data
    const offerProducts = listOfferProductData?.data?.flat().filter(Boolean) ?? [];
    setOfferProducts(offerProducts.length > 0 ? offerProducts : []);
    setFilteredOfferProducts(offerProducts.length > 0 ? offerProducts : []);
  }, [listProductData, listOfferData, listOfferProductData?.data]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleEditOfferProduct = useCallback(
    values => {
      const { offer_id, product_id } = values;
      useSaveOfferProduct.mutate({ product_offer_id: product_id, offer_id: offer_id });
      closeDrawer();
    },
    [useSaveOfferProduct, closeDrawer]
  );

  const handleCreateOfferProduct = useCallback(
    values => {
      useCreateOfferProduct.mutate(values);
      closeDrawer();
    },
    [useCreateOfferProduct, closeDrawer]
  );

  const editOfferProduct = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const deleteOfferProduct = useCallback(
    row => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );

  const handleAcceptDelete = useCallback(() => {
    useDeleteOfferProduct.mutate({ offer_product_id: deleteSingleData.offer_product_id });
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [useDeleteOfferProduct, deleteSingleData.offer_product_id, onDeleteSingleClose]);

  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredOfferProducts(offerProduct);
  }, [offerProduct]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredOfferProducts(e => e.filter(t => t.product_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'Change Offer',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editOfferProduct,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteOfferProduct,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'offer_product_id',
        hidden: true
      },
      {
        Header: 'Product Id',
        accessor: 'product_id',
        hidden: true
      },
      {
        Header: 'Product',
        accessor: 'product_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        headerWidth: '50vh',
        cellWidth: '50vh'
      },
      {
        Header: 'Offer Id',
        accessor: 'offer_id',
        hidden: true
      },
      {
        Header: 'Offer',
        accessor: 'offer_name',
        hidden: true
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
        Header: 'Discount Price',
        accessor: 'discount_price',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'offer_id',
      label: 'Offer',
      placeholder: '---',
      isCustomSelectionField: true,
      isReadOnly: Object.keys(editData).length === 0 ? true : false,
      selectionArray: listOfferArray ? [...listOfferArray] : []
    },
    {
      name: 'product_id',
      label: 'Product',
      placeholder: '---',
      isRequired: Object.keys(editData).length === 0 ? true : false,
      isCustomSelectionField: true,
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      selectionArray: listProductArray ? [...listProductArray] : []
    }
  ];

  const offerItem = listOfferArray.find(item => item.value === selectedOffer.id);
  const productItem = listProductArray.find(item => item.value === editData?.product_id);

  const initialValues = {
    offer_id: offerItem ? offerItem.value : '',
    product_id: productItem ? productItem.value : ''
  };
  // #endregion

  // #region UI
  if (
    isFetchingListOfferProduct ||
    isLoadingListOfferProduct ||
    isFetchingListProduct ||
    isLoadingListProduct ||
    isFetchingListOffer ||
    isLoadingListOffer
  )
    return <LoadingSpinner />;

  if (useCreateOfferProduct.isLoading || useSaveOfferProduct.isLoading || useDeleteOfferProduct.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`${selectedOffer.offer_name}`}
      TopSideButtons={
        <DynamicTopSide
          setSearchText={setSearchText}
          onAddEditOpen={onAddEditOpen}
          allowAddNew={true}
          showGoBack={true}
          type={`offerProduct`}
        />
      }
    >
      <Box marginTop="0px !important">
        {filteredOfferProducts && filteredOfferProducts.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredOfferProducts}
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
        handleEdit={handleEditOfferProduct}
        handleCreate={handleCreateOfferProduct}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
      />
      <ChakraAlertDialog title="Delete Single" isOpen={isDeleteSingleOpen} onClose={onDeleteSingleClose} onAccept={handleAcceptDelete} />
    </TitleCard>
  );
  // #endregion
}

export default OfferProductTable;
