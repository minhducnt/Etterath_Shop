import { Box, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { parseISO } from 'date-fns';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { offerService, useGetListOffer } from '../../../modules/services/OfferService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function OfferTable() {
  // #region Variables
  const navigation = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});

  const [offer, setOffers] = useState([[]]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listOfferData, isFetching, isLoading } = useGetListOffer();
  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useCreateOffer = useDynamicService(offerService.createOffer, 'listOffer');
  const useDeleteOffer = useDynamicService(offerService.deleteOffer, 'listOffer');

  useEffect(() => {
    const offers = listOfferData?.data?.flat().filter(Boolean) ?? [];
    setOffers(offers.length > 0 ? offers : []);
    setFilteredOffers(offers.length > 0 ? offers : []);
  }, [listOfferData]);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleCreateOffer = useCallback(
    values => {
      const offer_name = values;
      useCreateOffer.mutate(offer_name);
      closeDrawer();
    },
    [closeDrawer, useCreateOffer]
  );

  const viewOfferProducts = useCallback(
    row => {
      localStorage.setItem('selectedOffer', JSON.stringify(row));
      navigation(`/app/offers/${row.id}/products`);
    },
    [navigation]
  );

  const viewOffer = useCallback(
    row => {
      setEditData(row);
      onAddEditOpen();
    },

    [onAddEditOpen]
  );

  const deleteOffer = useCallback(
    row => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );

  const handleAcceptDelete = useCallback(() => {
    useDeleteOffer.mutate(deleteSingleData.id);
    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [deleteSingleData.id, onDeleteSingleClose, useDeleteOffer]);

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredOffers(offer);
  }, [offer]);

  const applySearch = useCallback(value => {
    const searchValue = value.toLowerCase();
    setFilteredOffers(e => e.filter(offer => offer.offer_name.toLowerCase().includes(searchValue)));
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
      func: viewOfferProducts,
      isDisabled: true
    },
    {
      actionName: 'View Details',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewOffer,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteOffer,
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
        Header: 'Offer',
        accessor: 'offer_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Description',
        accessor: 'description',
        headerWidth: '300px',
        cellWidth: '300px'
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
        Header: 'Start',
        accessor: 'start_date',
        haveFilter: {
          filterType: FilterType.DateTime
        },
        haveSort: true,
        type: 'dateTime'
      },
      {
        Header: 'Expiry',
        accessor: 'end_date',
        haveFilter: {
          filterType: FilterType.DateTime
        },
        haveSort: true,
        type: 'dateTime'
      }
    ],
    []
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'offer_name',
      label: 'Offer',
      placeholder: 'Luck Draw, Discount, etc',
      isRequired: true,
      isReadOnly: Object.keys(editData).length > 0 ? true : false
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Enter your description',
      isTextAreaField: true,
      isReadOnly: Object.keys(editData).length > 0 ? true : false
    },
    {
      name: 'discount_rate',
      label: 'Discount',
      isNumber: true,
      isRequired: true,
      isReadOnly: Object.keys(editData).length > 0 ? true : false
    },
    {
      name: 'start_date',
      label: 'Start',
      isDateField: true,
      isRequired: true,
      isReadOnly: Object.keys(editData).length > 0 ? true : false
    },
    {
      name: 'end_date',
      label: 'Expiry',
      isDateField: true,
      isRequired: true,
      isReadOnly: Object.keys(editData).length > 0 ? true : false
    }
  ];

  const initialValues = {
    offer_name: `${editData?.offer_name ?? ''}`,
    description: `${editData?.description ?? ''}`,
    discount_rate: `${editData?.discount_rate ?? 0}`,
    start_date: `${
      editData?.start_date ? new Date(editData?.start_date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10)
    }`,
    end_date: `${
      editData?.end_date
        ? new Date(new Date(editData?.end_date).setDate(new Date(editData?.end_date).getDate() + 7)).toISOString().substring(0, 10)
        : new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().substring(0, 10)
    }`
  };

  const validationSchema = Yup.object().shape({
    offer_name: Yup.string().required('This field is required'),
    description: Yup.string().min(6, 'Must be between 6 and 100.000 characters').max(100000, 'Must be between 6 and 100.000 characters'),
    discount_rate: Yup.number('This field must be a number')
      .required('This field is required')
      .min(1, 'Name must be between 1 and 100 rate')
      .max(100, 'Name must be between 1 and 100 rate'),
    start_date: Yup.date()
      .transform((value, originalValue) => parseISO(originalValue))
      .required('Start date is required'),
    end_date: Yup.date()
      .transform((value, originalValue) => parseISO(originalValue))
      .min(Yup.ref('start_date'), 'End date cannot be before start date')
      .required('End date is required')
  });
  // #endregion

  // #region UI
  if (isFetching || isLoading) return <LoadingSpinner />;
  if (useCreateOffer.isLoading || useDeleteOffer.isLoading) return <LoadingSpinner />;
  return (
    <TitleCard
      title={`Offer Management`}
      TopSideButtons={<DynamicTopSide setSearchText={setSearchText} onAddEditOpen={onAddEditOpen} allowAddNew={true} />}
    >
      <Box marginTop="0px !important">
        {filteredOffers && filteredOffers.length > 0 ? (
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={filteredOffers}
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
        handleCreate={handleCreateOffer}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerViewFieldData}
        customEditTitle="Details"
        hideAction={Object.keys(editData).length > 0 ? true : false}
      />
      <ChakraAlertDialog title="Delete Single" isOpen={isDeleteSingleOpen} onClose={onDeleteSingleClose} onAccept={handleAcceptDelete} />
    </TitleCard>
  );
  // #endregion
}

export default OfferTable;
