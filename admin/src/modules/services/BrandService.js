import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/brands';

const getListBrand = async () => {
  const response = await axiosBase.get(`${endPoint}`);
  return response.data;
};

const getBrandDetail = async brand_id => {
  const response = await axiosBase.get(`${endPoint}/${brand_id}`);
  return response.data;
};

const createBrand = async brand_name => {
  const response = await axiosBase.post(`${endPoint}`, brand_name);
  return response.data;
};

const updateBrand = async ({ id, brand_name }) => {
  const response = await axiosBase.put(`${endPoint}/${id}`, { brand_name });
  return response.data;
};

const deleteBrand = async brand_id => {
  const response = await axiosBase.delete(`${endPoint}/${brand_id}`);
  return response.data;
};

export const useGetListBrand = () => {
  return useQuery('listBrand', getListBrand, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const brandService = {
  getListBrand,
  getBrandDetail,
  createBrand,
  updateBrand,
  deleteBrand
};
