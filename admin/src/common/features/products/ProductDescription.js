import { Box, Flex, useDisclosure } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

import { useMutation } from 'react-query';

import { Formik } from 'formik';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useNavigate } from 'react-router-dom';

import { notifyError, notifySuccess } from '../../../helper/Toastify';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import { productService } from '../../../modules/services/ProductService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function ProductDescription() {
  // #region Variables
  const navigation = useNavigate();

  const [initialContent, setInitialContent] = useState('');
  const [selectedProduct, setSelectedProduct] = useState({});
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // #endregion

  // #region Hooks
  const { isOpen: isSaveDetailAlertOpen, onOpen: onSaveDetailAlertOpen, onClose: onSaveDetailAlertClose } = useDisclosure();

  const useSaveProductDetail = useMutation(productService.updateProduct, {
    onSuccess: res => {
      //  Handle response
      const { message } = res;
      notifySuccess(message);

      // Handle navigation
      localStorage.removeItem('selectedProduct');
      navigation(-1);
    },
    onError: error => {
      const { response } = error;
      notifyError(response.data.message);
    }
  });

  useEffect(() => {
    setIsLoading(true);
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
      setSelectedProduct(product);
      setContent(product.description);
      setInitialContent(product.description);
    }
    setIsLoading(false);
  }, []);

  const hasContentChanged = content !== initialContent;
  // #endregion

  // #region UI
  if (isLoading || useSaveProductDetail.isLoading) return <LoadingSpinner />;
  return (
    <Formik
      initialValues={{}}
      onSubmit={async values => {
        onSaveDetailAlertClose();

        const profileDetail = {
          ...selectedProduct,
          description: content
        };

        await useSaveProductDetail.mutateAsync(profileDetail).then(() => {
          localStorage.setItem('selectedProduct', JSON.stringify(profileDetail));
        });
      }}
    >
      {formik => (
        <TitleCard
          title={`${
            selectedProduct.product_name && selectedProduct.product_name.length > 20
              ? `${selectedProduct.product_name.slice(0, 50)}...`
              : selectedProduct.product_name
          }`}
          TopSideButtons={
            <DynamicTopSide
              onAddEditOpen={formik.isValid ? onSaveDetailAlertOpen : formik.handleSubmit}
              showGoBack={true}
              showSave={selectedProduct.isFromReport ? false : true}
              disableBtn={!hasContentChanged}
              type={`product`}
            />
          }
        >
          <Box marginTop="0px !important" h="65vh" display="flex" flexDirection="column">
            <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']} flex="1">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                style={{
                  backgroundColor: selectedProduct.isFromReport ? '#f7f7f7' : 'white',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '62.5vh'
                }}
                readOnly={selectedProduct.isFromReport ? true : false}
              />
            </Flex>

            <ChakraAlertDialog
              title="Save profile detail"
              message="Are you sure? This action will save your profile details."
              isOpen={isSaveDetailAlertOpen}
              onClose={onSaveDetailAlertClose}
              acceptButtonLabel="Confirm"
              type="submit"
              onAccept={formik.handleSubmit}
              acceptButtonColor="green"
            />
          </Box>
        </TitleCard>
      )}
    </Formik>
  );
  // #endregion
}

export default ProductDescription;
