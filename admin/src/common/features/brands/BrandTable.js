import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineEdit, AiOutlineFire, AiOutlineDelete } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { brandService, useGetListBrand } from '../../../modules/services/BrandService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function BrandTable() {
  // #region Variables
  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});

  const [brand, setBrands] = useState([[]]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listBrandData, isFetching, isLoading } = useGetListBrand();
  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateBrand = useDynamicService(brandService.createBrand, 'listBrand');
  const useDeleteBrand = useDynamicService(brandService.deleteBrand, 'listBrand');
  const useSaveBrand = useDynamicService(brandService.updateBrand, 'listBrand');

  useEffect(() => {
    const brands = listBrandData?.data?.flat().filter(Boolean) ?? [];
    setBrands(brands.length > 0 ? brands : []);
    setFilteredBrands(brands.length > 0 ? brands : []);
  }, [listBrandData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleEditBrand = useCallback(
    values => {
      const { id } = editData;
      const { brand_name } = values;
      useSaveBrand.mutate({ id, brand_name });
      closeDrawer();
    },
    [editData, useSaveBrand, closeDrawer]
  );

  const handleCreateBrand = useCallback(
    values => {
      useCreateBrand.mutate(values);
      closeDrawer();
    },
    [useCreateBrand, closeDrawer]
  );

  const editBrand = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const deleteBrand = useCallback(
    row => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );

  const handleAcceptDelete = useCallback(() => {
    useDeleteBrand.mutate(deleteSingleData.id);
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [useDeleteBrand, deleteSingleData.id, setDeleteSingleData, onDeleteSingleClose]);
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredBrands(brand);
  }, [brand]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredBrands(e => e.filter(brand => brand.brand_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Table
  const tableRowAction = [
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editBrand,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteBrand,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
        hidden: true
      },
      {
        Header: 'Brand',
        accessor: 'brand_name',
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
      name: 'brand_name',
      label: 'Brand',
      placeholder: 'Asus, Dell, HP, etc.',
      isRequired: true,
      leftIcon: <AiOutlineFire color="#999" fontSize="1.05rem" />
    }
  ];

  const initialValues = {
    brand_name: `${editData?.brand_name ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    brand_name: Yup.string()
      .required('This field is required')
      .min(0, 'Must be between 0 and 25 characters')
      .max(25, 'Must be between 0 and 25 characters')
  });
  // #endregion

  // #region UI
  if (isFetching || isLoading) return <LoadingSpinner />;
  if (useCreateBrand.isLoading || useSaveBrand.isLoading || useDeleteBrand.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Brand Management`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={onAddEditOpen} allowAddNew={true} />}
    >
      <Box marginTop="0px !important">
        {filteredBrands && filteredBrands.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredBrands}
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
        handleEdit={handleEditBrand}
        handleCreate={handleCreateBrand}
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

export default BrandTable;
