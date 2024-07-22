import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/stocks';

const getListStock = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const updateStock = async ({ sku, qty_to_add, qty_to_remove }) => {
  const response = await axiosBase.patch(`${endPoint}/`, {
    sku,
    qty_to_add: parseInt(qty_to_add),
    qty_to_remove: parseInt(qty_to_remove)
  });
  return response.data;
};

export const useGetListStock = () => {
  return useQuery('listStock', getListStock, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const stockService = {
  getListStock,
  updateStock
};
