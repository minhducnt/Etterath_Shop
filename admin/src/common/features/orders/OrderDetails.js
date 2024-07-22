import { Box, Flex, Stack } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

import { AiOutlineCompass, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';

import { Formik } from 'formik';

import TitleCard from '../../components/cards/TitleCard';
import FormTextField from '../../components/field/FormTextField';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import { useGetListAccount } from '../../../modules/services/AccountService';
import { useGetListOrder } from '../../../modules/services/OrderService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function OrderDetails() {
  // #region Variables
  const [orderAddress, setOrderAddress] = useState({});
  const [orderUser, setOrderUser] = useState({});

  const [selectedOrder, setSelectedOrder] = useState({});
  // #endregion

  // #region Hooks
  const { data: listOrderData, isFetching: isOrderFetching, isLoading: isOrderLoading } = useGetListOrder();
  const { data: listUserData, isFetching: isUserFetching, isLoading: isUserLoading } = useGetListAccount();

  useEffect(() => {
    // Handle get list order
    const orders = listOrderData?.data?.flat().filter(Boolean) ?? [];
    const users = listUserData?.data?.flat().filter(Boolean) ?? [];

    // Handle get selected order
    const selOrder = JSON.parse(localStorage.getItem('selectedOrder'));
    if (selOrder) {
      setSelectedOrder(selOrder);
    }

    // Handle get order address
    const orderAddress = orders.filter(order => order.shop_order_id === selOrder.shop_order_id);
    setOrderAddress(orderAddress[0]?.address ?? {});

    // Handle get order user
    const orderUser = users.filter(user => user.id === orderAddress[0].user_id);
    setOrderUser(orderUser[0]);
  }, [listOrderData?.data, listUserData?.data, orderUser]);
  // #endregion

  // #region Field
  const initialValues = {
    // User
    first_name: orderUser?.first_name ?? '',
    last_name: orderUser?.last_name ?? '',
    email: orderUser?.email ?? '',
    phone: orderAddress?.phone_number ?? '',

    // Order
    name: orderAddress?.name ?? '',
    detail_address: orderAddress?.detail_address ?? '',
    commune: orderAddress?.commune ?? '',
    district: orderAddress?.district ?? '',
    province: orderAddress?.province ?? '',
    country_name: orderAddress?.country_name ?? '',
    pincode: orderAddress?.pincode ?? ''
  };
  // #endregion

  // #region UI
  if (isOrderLoading || isOrderFetching || isUserLoading || isUserFetching) return <LoadingSpinner />;
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {() => (
        <TitleCard
          title={`Order #${selectedOrder.shop_order_id}`}
          TopSideButtons={<DynamicTopSide showGoBack={true} type={`orderProduct`} />}
        >
          <Box marginTop="0px !important">
            <Stack>
              <>
                <Stack spacing={4}>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField
                      name="first_name"
                      isReadOnly="true"
                      label="First Name"
                      leftIcon={<AiOutlineUser color="#999" fontSize="1.1rem" />}
                    />
                    <FormTextField
                      name="last_name"
                      isReadOnly="true"
                      label="Last Name"
                      leftIcon={<AiOutlineUser color="#999" fontSize="1.1rem" />}
                    />
                  </Flex>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField
                      name="phone"
                      isReadOnly="true"
                      label="Address Phone"
                      type="phone"
                      leftIcon={<AiOutlinePhone color="#999" fontSize="1.1rem" />}
                    />
                    <FormTextField
                      name="email"
                      isReadOnly="true"
                      label="Email"
                      type="email"
                      leftIcon={<AiOutlineMail color="#999" fontSize="1.1rem" />}
                    />
                  </Flex>

                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField
                      name="detail_address"
                      isReadOnly="true"
                      label="Address Details"
                      leftIcon={<AiOutlineCompass color="#999" fontSize="1.1rem" />}
                    />
                  </Flex>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField name="province" isReadOnly="true" label="Province" />
                    <FormTextField name="commune" isReadOnly="true" label="Commune" />
                    <FormTextField name="district" isReadOnly="true" label="District" />
                  </Flex>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField name="country_name" isReadOnly="true" label="Country" />
                    <FormTextField name="pincode" isReadOnly="true" label="Pincode" />
                  </Flex>
                </Stack>
              </>
            </Stack>
          </Box>
        </TitleCard>
      )}
    </Formik>
  );
  // #endregion
}

export default OrderDetails;
