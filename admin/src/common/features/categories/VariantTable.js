import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineAppstore, AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { categoryService, useGetListCategory, useGetCategoryVariants } from '../../../modules/services/CategoryService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function VariantTable() {
  // #region Variables
  const { categoryId } = useParams();
  const navigation = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});

  const [isCreateVariant, setIsCreateVariant] = useState(false);
  const [isUpdateVariant, setIsUpdateVariant] = useState(false);

  const [listCategoryArray, setListCategoryArray] = useState([[]]);

  const [variant, setVariants] = useState([[]]);
  const [filteredVariants, setFilteredVariants] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({});
  // #endregion

  // #region Hooks
  const { data: listCategoryData, isFetching: isFetchingListCategory, isLoading: isLoadingListCategory } = useGetListCategory();
  const { data: listVariantData, isFetching: isFetchingListVariant, isLoading: isLoadingListVariant } = useGetCategoryVariants(categoryId);

  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateVariant = useDynamicService(categoryService.createCategoryVariant, 'listVariant');
  const useUpdateVariant = useDynamicService(categoryService.updateCategoryVariant, 'listVariant');
  const useDeleteVariant = useDynamicService(categoryService.deleteCategoryVariant, 'listVariant');

  useEffect(() => {
    // Handle get selected category
    const category = JSON.parse(localStorage.getItem('selectedCategory'));
    if (category) {
      setSelectedCategory(category);
    }

    // Handle variant data
    const variants = listVariantData?.data?.flat().filter(Boolean) ?? [];
    setVariants(variants.length > 0 ? variants : []);
    setFilteredVariants(variants.length > 0 ? variants : []);
  }, [listVariantData]);

  useEffect(() => {
    if (listCategoryData && Array.isArray(listCategoryData.data)) {
      var categories = listCategoryData?.data?.flat() ?? [];

      if (categories.length > 0) {
        const categoryList = categories.map(category => {
          return {
            category_id: category.category_id,
            category_name: category.category_name
          };
        }, []);

        const subCategoryList = categories
          .map(category => {
            return (
              category?.sub_category?.map(subCategory => {
                return {
                  category_id: subCategory.sub_category_id,
                  category_name: subCategory.sub_category_name
                };
              }) || []
            );
          })
          .flat()
          .filter(subCategory => subCategory != null);

        categories = categoryList.concat(...subCategoryList);
        setListCategoryArray(Helper.convertToArraySelection(categories, 'category_name', 'category_id'));
      } else {
        setListCategoryArray([]);
      }
    } else {
      setListCategoryArray([]);
    }
  }, [listCategoryArray?.data, listCategoryData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
    setIsUpdateVariant(false);
    setIsCreateVariant(false);
  }, [onAddEditClose, setEditData, setIsUpdateVariant, setIsCreateVariant]);

  const handleCreateVariant = useCallback(
    values => {
      const category_id = categoryId;
      const { variation_names } = values;
      useCreateVariant.mutate({ category_id, variation_names });
      closeDrawer();
    },
    [categoryId, useCreateVariant, closeDrawer]
  );

  const handleEditVariant = useCallback(
    values => {
      useUpdateVariant.mutate({
        category_id: parseInt(categoryId, 10),
        variation_id: editData.variation_id,
        variation_name: values.variation_name
      });
      closeDrawer();
    },
    [categoryId, editData.variation_id, useUpdateVariant, closeDrawer]
  );

  const handleDeleteVariant = useCallback(() => {
    useDeleteVariant.mutate({ category_id: parseInt(categoryId, 10), variation_id: deleteSingleData.variation_id });
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [categoryId, deleteSingleData.variation_id, useDeleteVariant, setDeleteSingleData, onDeleteSingleClose]);

  const createVariant = useCallback(
    row => {
      onAddEditOpen();
      setIsCreateVariant(true);
      setIsUpdateVariant(false);
    },
    [onAddEditOpen, setIsCreateVariant, setIsUpdateVariant]
  );

  const viewOptions = useCallback(
    row => {
      localStorage.setItem('selectedVariant', JSON.stringify(row));
      navigation(`/app/categories/${categoryId}/variants/${row.variation_id}/options`);
    },
    [navigation, categoryId]
  );

  const editVariant = useCallback(
    row => {
      onAddEditOpen();
      setIsCreateVariant(false);
      setIsUpdateVariant(true);
      setEditData(row);
    },
    [onAddEditOpen, setIsCreateVariant, setIsUpdateVariant, setEditData]
  );

  const deleteVariant = useCallback(
    (row, action) => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredVariants(variant);
  }, [variant]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredVariants(e => e.filter(t => t.variation_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'View Option',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewOptions,
      isDisabled: true
    },
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editVariant,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteVariant,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'variation_id',
        hidden: true
      },
      {
        Header: 'Variant',
        accessor: 'variation_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Options',
        accessor: 'options',
        headerWidth: '100vh',
        cellWidth: '100vh'
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const baseFieldData = [
    {
      name: 'variation_names',
      label: 'Variation',
      placeholder: 'Size, Color, etc',
      isRequired: true,
      leftIcon: <AiOutlineAppstore color="#999" fontSize="1.05rem" />
    }
  ];

  const updateFieldData = [
    {
      name: 'variation_name',
      label: 'Variation',
      placeholder: 'Size, Color, etc',
      isRequired: true,
      leftIcon: <AiOutlineAppstore color="#999" fontSize="1.05rem" />
    }
  ];

  let drawerViewFieldData, validationSchema, initialValues;

  if (isCreateVariant) {
    drawerViewFieldData = baseFieldData;
    initialValues = {};
    validationSchema = Yup.object().shape({
      variation_names: Yup.string()
        .required('This field is required')
        .min(0, 'Must be between 0 and 256 characters')
        .max(256, 'Must be between 0 and 256 characters')
    });
  }

  if (isUpdateVariant) {
    drawerViewFieldData = updateFieldData;
    initialValues = {
      variation_name: editData.variation_name
    };
    validationSchema = Yup.object().shape({
      variation_name: Yup.string()
        .required('This field is required')
        .min(0, 'Must be between 0 and 256 characters')
        .max(256, 'Must be between 0 and 256 characters')
    });
  }
  // #endregion

  // #region UI
  if (isFetchingListVariant || isLoadingListVariant || isFetchingListCategory || isLoadingListCategory) return <LoadingSpinner />;
  if (useCreateVariant.isLoading || useUpdateVariant.isLoading || useDeleteVariant.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Category: ${selectedCategory.category_name ? selectedCategory.category_name : selectedCategory.sub_category_name}`}
      TopSideButtons={
        <DynamicTopSide
          setSearchText={setSearchText}
          onAddEditOpen={createVariant}
          allowAddNew={true}
          showGoBack={true}
          type={`categoryVariant`}
        />
      }
    >
      <Box marginTop="0px !important">
        {filteredVariants && filteredVariants.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredVariants}
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
        handleCreate={handleCreateVariant}
        handleEdit={handleEditVariant}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
      />
      <ChakraAlertDialog title="Delete Single" isOpen={isDeleteSingleOpen} onClose={onDeleteSingleClose} onAccept={handleDeleteVariant} />
    </TitleCard>
  );
  // #endregion
}

export default VariantTable;
