import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineAppstore, AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { Helper } from '../../../helper/Helper';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { categoryService, useGetListCategory } from '../../../modules/services/CategoryService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function SubCategoryTable() {
  // #region Variables
  const { categoryId } = useParams();
  const navigation = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});

  const [listCategoryArray, setListCategoryArray] = useState([[]]);

  const [category, setCategories] = useState([[]]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listCategoryData, isFetching: isFetchingListCategory, isLoading: isLoadingListCategory } = useGetListCategory();
  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateSubCategory = useDynamicService(categoryService.createSubCategory, 'listCategory');
  const useUpdateSubCategory = useDynamicService(categoryService.updateCategory, 'listCategory');
  const useDeleteSubCategory = useDynamicService(categoryService.deleteCategory, 'listCategory');

  useEffect(() => {
    if (listCategoryData && Array.isArray(listCategoryData.data)) {
      const categories = listCategoryData?.data?.flat() ?? [];
      if (categories.length > 0) {
        const filteredCategories = categories.filter(item => item.category_id === parseInt(categoryId));
        const subCategories = filteredCategories[0].sub_category;
        setCategories(subCategories);
        setListCategoryArray(Helper.convertToArraySelection(categories, 'category_name', 'category_id'));
        setFilteredCategories(subCategories);
      } else {
        setCategories([]);
        setListCategoryArray([]);
        setFilteredCategories([]);
      }
    } else {
      setCategories([]);
      setListCategoryArray([]);
      setFilteredCategories([]);
    }
  }, [categoryId, listCategoryData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleCreateSubCategory = useCallback(
    values => {
      useCreateSubCategory.mutate(values);
      closeDrawer();
    },
    [useCreateSubCategory, closeDrawer]
  );

  const createSubCategory = useCallback(
    row => {
      onAddEditOpen();
    },
    [onAddEditOpen]
  );

  const viewVariants = useCallback(
    row => {
      localStorage.setItem('selectedCategory', JSON.stringify(row));
      navigation(`/app/categories/${row.sub_category_id}/variants`);
    },
    [navigation]
  );

  const editSubCategory = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const handleEditSubCategory = useCallback(
    values => {
      const id = editData.sub_category_id;
      const { category_name } = values;
      useUpdateSubCategory.mutate({ category_id: id, category_name });
      closeDrawer();
    },
    [editData.sub_category_id, useUpdateSubCategory, closeDrawer]
  );

  const deleteSubCategory = useCallback(
    row => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );

  const handleAcceptDelete = useCallback(() => {
    useDeleteSubCategory.mutate(deleteSingleData.sub_category_id);
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [useDeleteSubCategory, deleteSingleData.sub_category_id, setDeleteSingleData, onDeleteSingleClose]);

  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredCategories(category);
  }, [category]);

  const applySearch = useCallback(value => {
    const searchValue = value.toLowerCase();
    setFilteredCategories(e => e.filter(t => t.sub_category_name.toLowerCase().includes(searchValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'View',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewVariants,
      isDisabled: true
    },
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editSubCategory,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteSubCategory,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'sub_category_id',
        hidden: true
      },
      {
        Header: 'Sub Category',
        accessor: 'sub_category_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true,
        cellWidth: '100vh',
        textAlign: 'start',
        headerAlign: 'start'
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
      isReadOnly: true,
      selectionArray: listCategoryArray ? [...listCategoryArray] : []
    },
    {
      name: 'category_name',
      label: 'Sub Category',
      placeholder: 'Gaming Laptop, Smart Phone, etc',
      isRequired: true,
      leftIcon: <AiOutlineAppstore color="#999" fontSize="1.05rem" />
    }
  ];

  const categoryItem = useMemo(() => {
    return listCategoryArray ? listCategoryArray.find(item => item.value === parseInt(categoryId)) : '';
  }, [listCategoryArray, categoryId]);

  const initialValues = {
    category_id: categoryItem ? categoryItem.value : '',
    category_name: `${editData?.sub_category_name ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    category_name: Yup.string().required('This field is required')
  });
  // #endregion

  // #region UI
  if (isFetchingListCategory || isLoadingListCategory) return <LoadingSpinner />;
  if (useCreateSubCategory.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`${categoryItem ? categoryItem.label : ''}`}
      TopSideButtons={
        <DynamicTopSide
          setSearchText={setSearchText}
          onAddEditOpen={createSubCategory}
          allowAddNew={true}
          showGoBack={true}
          type={`categoryProduct`}
        />
      }
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
        handleCreate={handleCreateSubCategory}
        handleEdit={handleEditSubCategory}
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

export default SubCategoryTable;
