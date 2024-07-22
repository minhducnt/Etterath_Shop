import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineBarcode } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { useGetCategoryVariants } from '../../../modules/services/CategoryService';
import { productService, useGetListProductItem } from '../../../modules/services/ProductService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function ProductItemTable() {
  // #region Variables
  const { productId } = useParams();

  const [editData, setEditData] = useState({});

  const [selVariantId, setVariantId] = useState(null);

  const [variants, setVariants] = useState([[]]);
  const [filteredProductItems, setFilteredProductItems] = useState([]);

  const [listVariationArray, setListVariationArray] = useState([[]]);
  const [listVariationOptionArray, setListVariationOptionArray] = useState([[]]);

  const { category_id, product_name } = JSON.parse(localStorage.getItem('selectedProduct'));

  // #endregion

  // #region Hooks
  const {
    data: listProductItemData,
    isFetching: isFetchingListProductItem,
    isLoading: isLoadingListProductItem
  } = useGetListProductItem(parseInt(productId));
  const { data: listVariantData, isFetching: isFetchingListVariant, isLoading: isLoadingListVariant } = useGetCategoryVariants(category_id);

  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateProductItem = useDynamicService(productService.createProductItem, 'listProductItem');

  useEffect(() => {
    // Handle product item data
    const productItems = listProductItemData?.data?.flat().filter(Boolean) ?? [];
    setFilteredProductItems(productItems.length > 0 ? productItems : []);

    // Handle variant data
    if (listVariantData && Array.isArray(listVariantData.data)) {
      const variants = listVariantData?.data?.flat() ?? [];
      setListVariationArray(Helper.convertToArraySelection(variants, 'variation_name', 'variation_id'));
      setVariants(variants);
    } else {
      setVariants([]);
      setListVariationArray([]);
    }
  }, [listProductItemData, listVariantData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleCreateProduct = useCallback(
    values => {
      const product_id = productId;
      const { qty_in_stock, variation_option_ids, sku } = values;
      useCreateProductItem.mutate({ product_id, qty_in_stock, variation_option_ids, sku });
      closeDrawer();
    },
    [productId, useCreateProductItem, closeDrawer]
  );
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
        hidden: true
      },
      {
        Header: 'Product Id',
        accessor: 'product_id',
        hidden: true
      },
      {
        Header: 'SKU',
        accessor: 'sku',
        hidden: false
      },
      {
        Header: 'Qty in Stock',
        accessor: 'qty_in_stock',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true
      },
      {
        Header: 'Sub Category',
        accessor: 'category_name',
        hidden: true
      },
      {
        Header: 'Main Category',
        accessor: 'main_category_name',
        hidden: true
      },
      {
        Header: 'Brand Id',
        accessor: 'brand_id',
        hidden: true
      },
      {
        Header: 'Brand',
        accessor: 'brand_name',
        hidden: true
      },
      {
        Header: 'Variation Options',
        id: 'variations',
        accessor: row => row.variation_values,
        Cell: ({ cell: { value } }) => (
          <div>
            {value.map((variation, i) => (
              <span key={i} style={{ padding: '4px' }}>
                {i > 0 && ', '}
                {variation.variation_value}
              </span>
            ))}
          </div>
        )
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'variation_id',
      label: 'Variants',
      placeholder: '---',
      isRequired: true,
      isCustomSelectionField: true,
      selectionArray: listVariationArray ? [...listVariationArray] : [],
      onChanged: e => {
        const newVariantId = e.value;
        setVariantId(newVariantId);
        const newSelectedVariant = variants?.find(e => e.variation_id === newVariantId);
        newSelectedVariant
          ? setListVariationOptionArray(
              Helper.convertToArraySelection(newSelectedVariant.options, 'variation_value', 'variation_option_id')
            )
          : setListVariationOptionArray([]);
      },
      hidden: Object.keys(editData).length === 0 ? false : true
    },
    {
      name: 'variation_option_ids',
      label: 'Options',
      placeholder: '---',
      isRequired: true,
      isMultiSelection: true,
      isReadOnly: !selVariantId,
      selectionArray: listVariationOptionArray ? [...listVariationOptionArray] : [],
      hidden: Object.keys(editData).length === 0 ? false : true
    },
    {
      name: 'sku',
      label: 'SKU',
      leftIcon: <AiOutlineBarcode className={`h-5 w-5`} />,
      isReadOnly: true,
      hidden: Object.keys(editData).length === 0 ? true : false
    },
    {
      name: 'qty_in_stock',
      label: 'Qty in Stock',
      isRequired: true,
      isNumber: true
    }
  ];

  const initialValues = {
    qty_in_stock: `${editData?.qty_in_stock ?? ''}`,
    sku: `${editData?.sku ?? ''}`,
    variation_option_ids: Helper.convertToArraySelection(editData?.variation_values, 'variation_value', 'variation_option_id') ?? []
  };

  const validationSchema = Yup.object().shape({
    qty_in_stock: Yup.number('This field must be a number').required('This field is required')
  });
  // #endregion

  // #region UI
  if (isLoadingListProductItem || isFetchingListProductItem || isFetchingListVariant || isLoadingListVariant) return <LoadingSpinner />;
  if (useCreateProductItem.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`${product_name && product_name.length > 20 ? `${product_name.slice(0, 50)}...` : product_name}`}
      TopSideButtons={
        <DynamicTopSide
          onAddEditOpen={onAddEditOpen}
          // allowAddNew={filteredProductItems && filteredProductItems.length > 0 ? false : true}
          allowAddNew={true}
          showGoBack={true}
          type={`product`}
        />
      }
    >
      <Box marginTop="0px !important">
        {filteredProductItems && filteredProductItems.length > 0 ? (
          <DynamicTable onAddEditOpen={onAddEditOpen} columns={columns} data={filteredProductItems} hideAction={true} />
        ) : (
          <Box h="65vh">
            <NoDataToDisplay />
          </Box>
        )}
      </Box>
      <DynamicDrawer
        handleCreate={handleCreateProduct}
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

export default ProductItemTable;
