import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { categoryService, useGetCategoryOptions } from '../../../modules/services/CategoryService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function OptionTable() {
  // #region Variables
  const { categoryId, variantId } = useParams();

  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});

  const [options, setOptions] = useState([[]]);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState({});
  // #endregion

  // #region Hooks
  const { data: listOptionData, isFetching, isLoading } = useGetCategoryOptions(categoryId, variantId);
  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateOption = useDynamicService(categoryService.createCategoryVariantOption, 'listOption');
  const useUpdateOption = useDynamicService(categoryService.updateCategoryVariantOption, 'listOption');
  const useDeleteOption = useDynamicService(categoryService.deleteCategoryVariantOption, 'listOption');

  useEffect(() => {
    // Handle get selected category
    const category = JSON.parse(localStorage.getItem('selectedVariant'));
    if (category) {
      setSelectedVariant(category);
    }

    // Handle option data
    const options = listOptionData?.data?.flat().filter(Boolean) ?? [];
    setOptions(options.length > 0 ? options : []);
    setFilteredOptions(options.length > 0 ? options : []);
  }, [listOptionData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleCreateOption = useCallback(
    values => {
      const { variation_value } = values;
      useCreateOption.mutate({ category_id: parseInt(categoryId, 10), variation_id: parseInt(variantId, 10), variation_value });
      closeDrawer();
    },
    [categoryId, variantId, useCreateOption, closeDrawer]
  );

  const handleEditOption = useCallback(
    values => {
      useUpdateOption.mutate({
        category_id: parseInt(categoryId),
        variation_id: parseInt(variantId),
        option_id: editData.variation_option_id,
        variation_value: values.variation_value
      });
      closeDrawer();
    },
    [categoryId, variantId, editData.variation_option_id, useUpdateOption, closeDrawer]
  );

  const handleDeleteOption = useCallback(() => {
    useDeleteOption.mutate({
      category_id: parseInt(categoryId),
      variation_id: parseInt(variantId),
      option_id: deleteSingleData.variation_option_id
    });
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [categoryId, variantId, deleteSingleData.variation_option_id, useDeleteOption, setDeleteSingleData, onDeleteSingleClose]);

  const editOption = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const deleteOption = useCallback(
    (row, action) => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredOptions(options);
  }, [options]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredOptions(e => e.filter(t => t.variation_value.toLowerCase().includes(lowerCaseValue)));
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
      func: editOption,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteOption,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'variation_option_id',
        hidden: true
      },
      {
        Header: 'Option',
        accessor: 'variation_value',
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
  const baseFieldData = [
    {
      name: 'variation_value',
      label: 'Option',
      placeholder: 'Red, Blue, etc',
      isRequired: true
    }
  ];

  const drawerViewFieldData = baseFieldData;

  const initialValues = {
    variation_value: `${editData.variation_value ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    variation_value: Yup.string().required('This field is required')
  });
  // #endregion

  // #region UI
  if (isFetching || isLoading) return <LoadingSpinner />;
  if (useCreateOption.isLoading || useUpdateOption.isLoading || useDeleteOption.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Variant: ${selectedVariant.variation_name}`}
      TopSideButtons={
        <DynamicTopSide
          setSearchText={setSearchText}
          onAddEditOpen={onAddEditOpen}
          allowAddNew={true}
          showGoBack={true}
          type={`categoryOption`}
        />
      }
    >
      <Box marginTop="0px !important">
        {filteredOptions && filteredOptions.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredOptions}
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
        handleCreate={handleCreateOption}
        handleEdit={handleEditOption}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
      />
      <ChakraAlertDialog title="Delete Single" isOpen={isDeleteSingleOpen} onClose={onDeleteSingleClose} onAccept={handleDeleteOption} />
    </TitleCard>
  );
  // #endregion
}

export default OptionTable;
