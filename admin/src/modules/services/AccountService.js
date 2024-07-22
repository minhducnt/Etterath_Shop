import { useQuery } from 'react-query';

import axiosBase, { baseURL, publicBaseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/users';
const endPointAddress = publicBaseURL + '/account/address';

const getListAccount = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const getListAddress = async () => {
  const response = await axiosBase.get(`${endPointAddress}/`);
  return response.data;
};

const blockAccount = async ({ user_id, block }) => {
  const response = await axiosBase.patch(`${endPoint}/block`, { user_id, block });
  return response.data;
};

export const useGetListAddress = () => {
  return useQuery('listAddress', getListAddress, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListAccount = () => {
  return useQuery('listAccount', getListAccount, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const accountService = {
  getListAccount,
  blockAccount
};
