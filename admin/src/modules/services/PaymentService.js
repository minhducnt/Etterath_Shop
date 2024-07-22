import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/payment-methods';

const getListPaymentMethod = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const updatePaymentMethod = async ({ id, block_status, maximum_amount }) => {
  const response = await axiosBase.put(`${endPoint}/`, {
    id,
    block_status: JSON.parse(block_status),
    maximum_amount: parseInt(maximum_amount)
  });
  return response.data;
};

export const useGetListPaymentMethod = () => {
  return useQuery('listPayment', getListPaymentMethod, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const paymentService = {
  getListPaymentMethod,
  updatePaymentMethod
};
