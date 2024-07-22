import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/orders';

const getListOrder = async () => {
  const response = await axiosBase.get(`${endPoint}/all`);
  return response.data;
};

const getListOrderByUserId = async id => {
  const response = await axiosBase.get(`${endPoint}/all/${id}`);
  return response.data;
};

const getListOrderItem = async id => {
  const response = await axiosBase.get(`${endPoint}/${id}/items`);
  return response.data;
};

const updateOrderStatus = async ({ shop_order_id, order_status_id }) => {
  const response = await axiosBase.put(`${endPoint}/`, {
    shop_order_id: shop_order_id,
    order_status_id: order_status_id
  });
  return response.data;
};

const getListOrderStatus = async () => {
  const response = await axiosBase.get(`${endPoint}/statuses/`);
  return response.data;
};

const getListOrderReturn = async () => {
  const response = await axiosBase.get(`${endPoint}/returns`);
  return response.data;
};

const getListOrderReturnPending = async () => {
  const response = await axiosBase.get(`${endPoint}/returns/pending`);
  return response.data;
};

const updateOrderReturnRequest = async ({ order_return_id, order_status_id, return_date, admin_comment }) => {
  const response = await axiosBase.put(`${endPoint}/returns/pending`, {
    order_return_id,
    order_status_id,
    return_date: new Date(return_date).toISOString(),
    admin_comment
  });
  return response.data;
};

export const useGetListOrder = () => {
  return useQuery('listOrder', getListOrder, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListOrderByUserId = id => {
  return useQuery(['listOrderByUserId', id], () => getListOrderByUserId(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListOrderStatus = () => {
  return useQuery('listOrderStatus', getListOrderStatus, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListOrderItem = id => {
  return useQuery(['listOrderItem', id], () => getListOrderItem(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListOrderReturn = () => {
  return useQuery('listOrderReturn', getListOrderReturn, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListOrderReturnPending = () => {
  return useQuery('listOrderReturnPending', getListOrderReturnPending, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const orderService = {
  getListOrderItem,
  updateOrderStatus,
  getListOrderStatus,
  getListOrderReturn,
  getListOrderReturnPending,
  updateOrderReturnRequest
};
