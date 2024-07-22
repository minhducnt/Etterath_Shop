import { Box, useDisclosure } from '@chakra-ui/react';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AiOutlineDesktop, AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';

import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { useGetListBrand } from '../../../modules/services/BrandService';
import { useGetListCategory } from '../../../modules/services/CategoryService';
import { productService, useGetListProduct } from '../../../modules/services/ProductService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function ProductTable() {
  // #region Variables
  const navigation = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});

  const [category, setCategories] = useState([[]]);
  const [product, setProducts] = useState([[]]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [listBrandArray, setListBrandArray] = useState([[]]);
  const [listCategoryArray, setListCategoryArray] = useState([[]]);
  const [listSubCategoryArray, setListSubCategoryArray] = useState([[]]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // #endregion

  // #region Hooks
  const { data: listProductData, isFetching: isFetchingListProduct, isLoading: isLoadingListProduct } = useGetListProduct();
  const { data: listBrandData, isFetching: isFetchingListBrand, isLoading: isLoadingListBrand } = useGetListBrand();
  const { data: listCategoryData, isFetching: isFetchingListCategory, isLoading: isLoadingListCategory } = useGetListCategory();

  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateProduct = useDynamicService(productService.createProduct, 'listProduct', true);
  const useSaveProduct = useDynamicService(productService.updateProduct, 'listProduct', true);

  useEffect(() => {
    // Clear local storage
    localStorage.removeItem('selectedProduct');

    // Handle  product data
    const products = listProductData?.data?.flat().filter(Boolean) ?? [];
    setProducts(products.length > 0 ? products : []);
    setFilteredProducts(products.length > 0 ? products : []);

    // Handle brand data
    if (listBrandData && Array.isArray(listBrandData.data)) {
      const brands = listBrandData?.data?.flat() ?? [];
      brands.length > 0 && brands[0] !== null
        ? setListBrandArray(Helper.convertToArraySelection(brands, 'brand_name', 'id'))
        : setListBrandArray();
    }

    // Handle category data
    if (listCategoryData && Array.isArray(listCategoryData.data)) {
      const categories = listCategoryData?.data?.flat() ?? [];
      if (categories.length > 0 && categories[0] !== null) {
        setCategories(categories);
        setListCategoryArray(Helper.convertToArraySelection(categories, 'category_name', 'category_id'));
      } else {
        setCategories();
      }
    }
  }, [listBrandData, listCategoryData, listProductData?.data]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
    setSelectedCategoryId(null);
    setSelectedCategory(null);
  }, [onAddEditClose]);

  const handleEditProduct = values => {
    const product_id = editData.product_id;
    const properties = editData.properties;
    const { product_name, description, category_id, price, puscharge_price, brand_id, images } = values;
    useSaveProduct.mutate({ product_id, product_name, description, category_id, price, puscharge_price, brand_id, images, properties });
    closeDrawer();
  };

  const handleCreateProduct = useCallback(
    values => {
      useCreateProduct.mutate(values);
      closeDrawer();
    },
    [closeDrawer, useCreateProduct]
  );

  const viewItems = useCallback(
    row => {
      localStorage.setItem('selectedProduct', JSON.stringify(row));
      navigation(`/app/models/${row.product_id}/items`);
    },
    [navigation]
  );

  const viewAdditional = useCallback(
    row => {
      localStorage.setItem('selectedProduct', JSON.stringify(row));
      navigation(`/app/models/${row.product_id}/additional`);
    },
    [navigation]
  );

  const viewDescription = useCallback(
    row => {
      localStorage.setItem('selectedProduct', JSON.stringify(row));
      navigation(`/app/models/${row.product_id}/description`);
    },
    [navigation]
  );

  const editProduct = useCallback(
    values => {
      setEditData(values);
      if (values.main_category_name === values.category_name) {
        setSelectedCategory(null);
      } else {
        const newCategoryName = values.main_category_name;
        const newSelectedCategory = category.find(category => category.category_name === newCategoryName);
        if (newSelectedCategory) {
          setSelectedCategory(newSelectedCategory?.sub_category);
          setListSubCategoryArray(Helper.convertToArraySelection(newSelectedCategory.sub_category, 'sub_category_name', 'sub_category_id'));
        } else {
          setSelectedCategory([]);
          setListSubCategoryArray([]);
        }
      }
      onAddEditOpen();
    },
    [category, onAddEditOpen]
  );
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredProducts(product);
  }, [product]);

  const applySearch = useCallback(value => {
    const searchValueLower = value.toLowerCase();
    setFilteredProducts(e => e.filter(product => product.product_name.toLowerCase().includes(searchValueLower)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
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
      actionName: 'View Description',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewDescription,
      isDisabled: true
    },
    {
      actionName: 'Additional Information',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewAdditional,
      isDisabled: true
    },
    {
      actionName: 'Edit Product',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editProduct,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'product_id',
        hidden: true
      },
      {
        Header: 'Images',
        accessor: 'images'
      },
      {
        Header: 'Product',
        accessor: 'product_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        cellWidth: '240px',
        headerWidth: '240px',
        headerAlign: 'center',
        textAlign: 'center'
      },
      {
        Header: 'Description',
        accessor: 'description',
        hidden: true
      },
      {
        Header: 'Sub Category Id',
        accessor: 'category_id',
        hidden: true
      },
      {
        Header: 'Sub Category',
        accessor: 'category_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        hidden: false,
        cellWidth: '160px',
        headerWidth: '160px',
        headerAlign: 'center',
        textAlign: 'center'
      },
      {
        Header: 'Main Category Id',
        accessor: 'main_category_id',
        hidden: true
      },
      {
        Header: 'Main Category',
        accessor: 'main_category_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        hidden: false,
        cellWidth: '160px',
        headerWidth: '160px',
        headerAlign: 'center',
        textAlign: 'center'
      },
      {
        Header: 'Brand Id',
        accessor: 'brand_id',
        hidden: true
      },
      {
        Header: 'Brand',
        accessor: 'brand_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        hidden: false,
        cellWidth: '160px',
        headerWidth: '160px',
        headerAlign: 'center',
        textAlign: 'center'
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
        textAlign: 'end',
        Cell: ({ row }) => {
          const { discount_price, price } = row.original;
          let discount = discount_price === 0 ? price : discount_price;
          return <Box>{`${Helper.formatCurrency(discount)}`}</Box>;
        }
      },
      {
        Header: 'Properties',
        accessor: 'properties',
        hidden: true
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'category_id',
      label: 'Category',
      placeholder: '---',
      isCustomSelectionField: true,
      isReadOnly: Object.keys(editData).length === 0 ? false : true || selectedCategoryId === null,
      selectionArray: listCategoryArray ? [...listCategoryArray] : [],
      onChanged: e => {
        const newCategoryId = e.value;
        setSelectedCategoryId(newCategoryId);
        const newSelectedCategory = category?.find(category => category.category_id === newCategoryId);
        setSelectedCategory(newSelectedCategory?.sub_category);
        newSelectedCategory
          ? setListSubCategoryArray(
              Helper.convertToArraySelection(newSelectedCategory.sub_category, 'sub_category_name', 'sub_category_id')
            )
          : setListSubCategoryArray([]);
      }
    },
    {
      name: 'sub_category_id',
      label: 'Sub Category',
      placeholder: '---',
      isCustomSelectionField: true,
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      selectionArray: listSubCategoryArray ? [...listSubCategoryArray] : [],
      hidden: !selectedCategory
    },
    {
      name: 'brand_id',
      label: 'Brand',
      placeholder: '---',
      isCustomSelectionField: true,
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      selectionArray: listBrandArray ? [...listBrandArray] : []
    },
    {
      name: 'product_name',
      label: 'Product',
      placeholder: 'Sony Vaio, Dell XPS, etc.',
      isRequired: true,
      leftIcon: <AiOutlineDesktop color="#999" fontSize="1.105rem" />
    },
    {
      name: 'price',
      label: 'Price',
      isCurrency: true,
      isRequired: true
    },
    {
      name: 'puscharge_price',
      label: 'Purchase Price',
      isCurrency: true,
      isRequired: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Enter your description',
      isRequired: true,
      isQuill: true,
      height: '150px',
      hidden: Object.keys(editData).length === 0 ? false : true
    },
    {
      name: 'images',
      label: 'Images',
      isRequired: Object.keys(editData).length !== 0 ? false : true,
      isImgUpload: true
    }
  ];

  const categoryItem = listCategoryArray.find(item => item.label === editData?.main_category_name);
  const subCategoryItem = listSubCategoryArray?.find(item => item.label === editData?.category_name);
  const brandItem = listBrandArray.find(item => item.label === editData?.brand_name);

  const initialValues = {
    product_name: `${editData?.product_name ?? ''}`,
    price: `${editData?.price ?? 0}`,
    puscharge_price: `${editData?.puscharge_price ?? 0}`,
    description: `${editData?.description ?? ''}`,
    brand_id: brandItem ? brandItem.value : 0,
    category_id: categoryItem ? categoryItem.value : 0,
    sub_category_id: subCategoryItem ? subCategoryItem.value : 0,
    properties: `${editData?.properties ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    product_name: Yup.string()
      .required('This field is required')
      .min(0, 'Name must be between 0 and 256 characters')
      .max(256, 'Name must be between 0 and 256 characters'),
    description: Yup.string()
      .required('This field is required')
      .min(6, 'Name must be between 6 and 100000 characters')
      .max(100000, 'Name must be between 6 and 100.000 characters'),
    price: Yup.number('This field must be a number').required('This field is required').min(0, 'Price must be greater than 0'),
    puscharge_price: Yup.number('This field must be a number').required('This field is required').min(0, 'Price must be greater than 0')
  });
  // #endregion

  // #region UI
  if (
    isFetchingListProduct ||
    isLoadingListProduct ||
    isFetchingListBrand ||
    isFetchingListCategory ||
    isLoadingListBrand ||
    isLoadingListCategory
  )
    return <LoadingSpinner />;
  if (useCreateProduct.isLoading || useSaveProduct.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Product Management`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={onAddEditOpen} allowAddNew={true} />}
    >
      <Box marginTop="0px !important">
        {filteredProducts && filteredProducts.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredProducts}
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
        handleEdit={handleEditProduct}
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

export default ProductTable;
