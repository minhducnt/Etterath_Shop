import { Box, useDisclosure } from '@chakra-ui/react';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useMutation } from 'react-query';

import * as Yup from 'yup';

import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import { notifyError, notifySuccess } from '../../../helper/Toastify';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import AdditionalTable from '../../components/tables/AdditionalTable';
import DynamicDrawer from '../../components/tables/DynamicDrawer';
import { productService } from '../../../modules/services/ProductService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function ProductAdditional() {
  // #region Variables
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});

  const [jsonObject, setJsonObject] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState({});
  // #endregion

  // #region Hooks
  const { isOpen: isDeleteSingleOpen, onOpen: onDeleteSingleOpen, onClose: onDeleteSingleClose } = useDisclosure();
  const { isOpen: isAddEditOpen, onOpen: onAddEditOpen, onClose: onAddEditClose } = useDisclosure();

  const useSaveProductDetail = useMutation(productService.updateProduct, {
    onSuccess: res => {
      //  Handle response
      const { message } = res;
      notifySuccess(message);
    },
    onError: error => {
      const { response } = error;
      notifyError(response.data.message);
    }
  });

  useEffect(() => {
    // Handle  product data
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
      setSelectedProduct(product);

      // Handle product properties
      const productProperties = product.properties.trim();

      if (!productProperties) {
        localStorage.setItem('productProperties', JSON.stringify([{}]));
        setJsonObject(productProperties);
      } else {
        setJsonObject(JSON.parse(productProperties));
      }
    }
  }, []);
  // #endregion

  // #region Methods
  const closeDrawer = useCallback(() => {
    onAddEditClose();
    setEditData({});
  }, [onAddEditClose, setEditData]);

  const handleEditAddition = useCallback(
    values => {
      const updatedData = jsonObject.map(item => {
        if (item.key === editData.key) {
          return { ...item, ...values };
        }
        return item;
      });

      setJsonObject(updatedData);

      useSaveProductDetail.mutateAsync({ ...selectedProduct, properties: JSON.stringify(updatedData) });

      closeDrawer();
      setEditData({});
    },
    [closeDrawer, editData.key, jsonObject, selectedProduct, useSaveProductDetail]
  );

  const editAddition = useCallback(
    row => {
      onAddEditOpen();
      setEditData(row);
    },
    [onAddEditOpen, setEditData]
  );

  const handleCreateAddition = useCallback(
    values => {
      // Check if the jsonObject is empty
      if (jsonObject === '') {
        setJsonObject([values]);
        useSaveProductDetail.mutateAsync({ ...selectedProduct, properties: JSON.stringify([values]) });
        closeDrawer();
        return;
      }

      // Check if the key already exists
      const keyExists = jsonObject.find(item => item.key === values.key);

      if (keyExists) {
        notifyError('Key already exists');
        return;
      }

      setJsonObject(currentItems => [...currentItems, values]);

      useSaveProductDetail.mutateAsync({ ...selectedProduct, properties: JSON.stringify([...jsonObject, values]) });
      closeDrawer();
    },
    [closeDrawer, jsonObject, selectedProduct, useSaveProductDetail]
  );

  const deleteAddition = useCallback(
    row => {
      setDeleteSingleData(row);
      onDeleteSingleOpen();
    },
    [setDeleteSingleData, onDeleteSingleOpen]
  );

  const handleAcceptDelete = useCallback(() => {
    const updatedData = jsonObject.filter(item => item.key !== deleteSingleData.key);
    localStorage.setItem('productProperties', JSON.stringify(updatedData));
    setJsonObject(updatedData);
    useSaveProductDetail.mutateAsync({ ...selectedProduct, properties: JSON.stringify(updatedData) });

    setDeleteSingleData({});
    onDeleteSingleClose();
  }, [jsonObject, useSaveProductDetail, selectedProduct, onDeleteSingleClose, deleteSingleData.key]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'Edit',
      icon: <AiOutlineEdit className={`h-5 w-5`} />,
      func: editAddition,
      isDisabled: true
    },
    {
      actionName: 'Delete',
      icon: <AiOutlineDelete className={`h-5 w-5`} />,
      func: deleteAddition,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Key',
        accessor: 'key',
        headerAlign: selectedProduct.isFromReport ? 'center' : 'start',
        textAlign: selectedProduct.isFromReport ? 'center' : 'start'
      },
      {
        Header: 'Information',
        accessor: 'value',
        headerAlign: selectedProduct.isFromReport ? 'center' : 'start',
        textAlign: selectedProduct.isFromReport ? 'center' : 'start'
      }
    ],
    [selectedProduct.isFromReport]
  );
  // #endregion

  // #region Drawer
  const drawerViewFieldData = [
    {
      name: 'key',
      label: 'Key',
      placeholder: 'Model, Processor, RAM, Storage, etc.',
      isRequired: true
    },
    {
      name: 'value',
      label: 'Description',
      placeholder: '',
      isRequired: true
    }
  ];

  const initialValues = {
    key: `${editData?.key ?? ''}`,
    value: `${editData?.value ?? ''}`
  };

  const validationSchema = Yup.object().shape({
    key: Yup.string()
      .required('This field is required')
      .min(0, 'Must be between 0 and 256 characters')
      .max(256, 'Must be between 0 and 256 characters'),
    value: Yup.string()
      .required('This field is required')
      .min(0, 'Must be between 0 and 100.000 characters')
      .max(100000, 'Must be between 0 and 100.000 characters')
  });
  // #endregion

  // #region UI
  return (
    <TitleCard
      title={`${
        selectedProduct.product_name && selectedProduct.product_name.length > 20
          ? `${selectedProduct.product_name.slice(0, 50)}...`
          : selectedProduct.product_name
      }`}
      TopSideButtons={
        <DynamicTopSide
          onAddEditOpen={onAddEditOpen}
          showGoBack={true}
          allowAddNew={selectedProduct.isFromReport ? false : true}
          showSearch={true}
          type={`productDetail`}
        />
      }
    >
      <Box marginTop="0px !important">
        {jsonObject && jsonObject.length > 0 ? (
          <AdditionalTable
            onAddEditOpen={onAddEditOpen}
            columns={columns}
            data={jsonObject}
            tableRowAction={tableRowAction}
            hideAction={selectedProduct.isFromReport ? true : false}
          />
        ) : (
          <Box h="65vh">
            <NoDataToDisplay />
          </Box>
        )}
      </Box>
      <DynamicDrawer
        handleEdit={handleEditAddition}
        handleCreate={handleCreateAddition}
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

export default ProductAdditional;
