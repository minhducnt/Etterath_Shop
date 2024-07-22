import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineAppstore, AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { categoryService, useGetListCategory } from '../../../modules/services/CategoryService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function CategoryTable() {
  // #region Variables
  const navigation = useNavigate();

  const [deleteSingleData, setDeleteSingleData] = useState({});
  const [editData, setEditData] = useState({});

  const [category, setCategories] = useState([[]]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [searchText, setSearchText] = useState('');
  // #endregion

  // #region Hooks
  const { data: listCategoryData, isFetching: isFetchingListCategory, isLoading: isLoadingListCategory } = useGetListCategory();
  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateCategory = useDynamicService(categoryService.createCategory, 'listCategory');
  const useCreateSubCategory = useDynamicService(categoryService.createSubCategory, 'listCategory');
  const useUpdateCategory = useDynamicService(categoryService.updateCategory, 'listCategory');
  const useDeleteCategory = useDynamicService(categoryService.deleteCategory, 'listCategory');

  useEffect(() => {
    const categories = listCategoryData?.data?.flat().filter(Boolean) ?? [];
    setCategories(categories.length > 0 ? categories : []);
    setFilteredCategories(categories.length > 0 ? categories : []);
  }, [listCategoryData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleCreateCategory = useCallback(
    values => {
      useCreateCategory.mutate(values);
      closeDrawer();
    },
    [useCreateCategory, closeDrawer]
  );

  const createCategory = useCallback(() => {
    onAddEditOpen();
  }, [onAddEditOpen]);

  const viewVariants = useCallback(
    row => {
      localStorage.setItem('selectedCategory', JSON.stringify(row));
      navigation(`/app/categories/${row.category_id}/variants`);
    },
    [navigation]
  );

  const viewSubCategories = useCallback(
    row => {
      localStorage.setItem('selectedCategory', JSON.stringify(row));
      navigation(`/app/categories/${row.category_id}/sub-categories`);
    },
    [navigation]
  );

  const editCategory = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const handleEditCategory = useCallback(
    values => {
      const id = editData.category_id;
      const { category_name } = values;
      useUpdateCategory.mutate({ category_id: id, category_name });
      closeDrawer();
    },
    [editData, useUpdateCategory, closeDrawer]
  );

  const deleteCategory = useCallback(
    row => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );

  const handleAcceptDelete = useCallback(() => {
    useDeleteCategory.mutate(deleteSingleData.category_id);
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [useDeleteCategory, deleteSingleData, setDeleteSingleData, onDeleteSingleClose]);
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredCategories(category);
  }, [category]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredCategories(e => e.filter(t => t.category_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'View Variants',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewVariants,
      isDisabled: true
    },
    {
      actionName: 'View Sub Categories',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewSubCategories,
      isDisabled: true
    },
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editCategory,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteCategory,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'category_id',
        hidden: true
      },
      {
        Header: 'Category',
        accessor: 'category_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Sub Category',
        accessor: 'sub_category',
        headerWidth: '100vh',
        cellWidth: '100vh'
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'category_name',
      label: 'Category',
      placeholder: 'Laptop, Mobile, etc',
      isRequired: true,
      leftIcon: <AiOutlineAppstore color="#999" fontSize="1.05rem" />
    }
  ];

  const initialValues = {
    category_name: `${editData?.category_name ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    category_name: Yup.string()
      .required('This field is required')
      .min(0, 'Must be between 0 and 256 characters')
      .max(256, 'Must be between 0 and 256 characters')
  });
  // #endregion

  // #region UI
  if (isFetchingListCategory || isLoadingListCategory) return <LoadingSpinner />;
  if (useCreateCategory.isLoading || useCreateSubCategory.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Category Management`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={createCategory} allowAddNew={true} />}
    >
      <Box marginTop="0px !important">
        {filteredCategories && filteredCategories.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredCategories}
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
        handleCreate={handleCreateCategory}
        handleEdit={handleEditCategory}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
      />
      <ChakraAlertDialog title="Delete Single" isOpen={isDeleteSingleOpen} onClose={onDeleteSingleClose} onAccept={handleAcceptDelete} />
    </TitleCard>
  );
  // #endregion
}

export default CategoryTable;
