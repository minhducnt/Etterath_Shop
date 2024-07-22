import { Box, Flex, Icon, SimpleGrid, Stack } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

import { AiOutlineAppstore, AiOutlineDollarCircle, AiOutlineFileText, AiOutlineFire } from 'react-icons/ai';

import { Formik } from 'formik';

import { useParams } from 'react-router-dom';

import { Helper } from '../../../helper/Helper';
import MiniStatistics from '../../components/cards/MiniStatistics';
import TitleCard from '../../components/cards/TitleCard';
import FormTextField from '../../components/field/FormTextField';
import IconBox from '../../components/icons/IconBox';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import { useGetProductById } from '../../../modules/services/ProductService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function ProductDetails() {
  // #region Variables
  const { productId } = useParams();

  const [selectedProduct, setSelectedProduct] = useState({});
  // #endregion

  // #region Hooks
  const { data: listProductData, isFetching: isFetchingListProduct, isLoading: isLoadingListProduct } = useGetProductById(productId);
  const [selProduct] = listProductData?.data?.flat() || [];

  useEffect(() => {
    // Handle get list product
    const products = listProductData?.data?.flat().filter(Boolean) ?? [];
    if (products.length > 0) {
      setSelectedProduct(products[0]);

      const newProduct = {
        ...products[0],
        isFromReport: true
      };

      localStorage.setItem('selectedProduct', JSON.stringify(newProduct));
    }
  }, [listProductData]);
  // #endregion

  // #region Field
  const initialValues = {
    product_name: selProduct?.product_name ?? '',
    price: Helper.formatCurrency(selProduct?.price),
    puscharge_price: Helper.formatCurrency(selProduct?.puscharge_price),
    discount_price: Helper.formatCurrency(selProduct?.discount_price),
    brand_name: selProduct?.brand_name ?? '',
    main_category_name: selProduct?.main_category_name ?? '',
    category_name: selProduct?.category_name ?? '',
    description: selProduct?.description ?? ''
  };
  // #endregion

  // #region UI
  if (isFetchingListProduct || isLoadingListProduct) return <LoadingSpinner />;
  return (
    <Formik initialValues={initialValues}>
      {() => (
        <Box>
          <TitleCard title={`${selectedProduct?.product_name}`} TopSideButtons={<DynamicTopSide showGoBack={true} type={`product`}/>}>
            <Box marginTop="0px !important">
              <Stack>
                <>
                  <Stack spacing={4}>
                    <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                      <FormTextField
                        name="price"
                        isReadOnly="true"
                        label="Price"
                        leftIcon={<AiOutlineDollarCircle color="#999" fontSize="1.1rem" />}
                      />
                      <FormTextField
                        name="puscharge_price"
                        isReadOnly="true"
                        label="Purchase Price"
                        leftIcon={<AiOutlineDollarCircle color="#999" fontSize="1.1rem" />}
                      />
                      <FormTextField
                        name="discount_price"
                        isReadOnly="true"
                        label="Discount Price"
                        leftIcon={<AiOutlineDollarCircle color="#999" fontSize="1.1rem" />}
                      />
                    </Flex>

                    <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                      <FormTextField
                        name="brand_name"
                        isReadOnly="true"
                        label="Brand"
                        leftIcon={<AiOutlineFire color="#999" fontSize="1.1rem" />}
                      />
                      <FormTextField
                        name="main_category_name"
                        isReadOnly="true"
                        label="Main Category"
                        leftIcon={<AiOutlineAppstore color="#999" fontSize="1.1rem" />}
                      />
                      <FormTextField
                        name="category_name"
                        isReadOnly="true"
                        label="Sub Category"
                        leftIcon={<AiOutlineAppstore color="#999" fontSize="1.1rem" />}
                      />
                    </Flex>
                  </Stack>
                </>
              </Stack>
            </Box>
          </TitleCard>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 2 }} gap="20px" mt="24px">
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineFileText} color={`black`} />} />
              }
              name="View description"
              linkTo={`description`}
            />
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg="white" icon={<Icon w="28px" h="28px" as={AiOutlineFileText} color={`black`} />} />
              }
              name="View specs"
              linkTo={`additional`}
            />
          </SimpleGrid>
        </Box>
      )}
    </Formik>
  );
  // #endregion
}

export default ProductDetails;
