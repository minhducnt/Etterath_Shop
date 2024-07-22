import { useQuery } from 'react-query';

import { jwtDecode } from 'jwt-decode';

import { AXIOS_HELPER } from '../../helper/constants/GlobalConstantUtil';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const accountEndpoint = baseURL + '/profile';

const { ACCESS_TOKEN } = AXIOS_HELPER;

const getProfile = async () => {
  const decoded = jwtDecode(JSON.parse(localStorage.getItem(ACCESS_TOKEN)));
  const response = await axiosBase.get(`${accountEndpoint}/${decoded.UserID}/`);
  return response.data;
};

const updateProfile = async ({ profileDetail }) => {
  const response = await axiosBase.put(`${accountEndpoint}/${profileDetail.user_id}/`, profileDetail);
  return response.data;
};

export const useGetProfile = () => {
  return useQuery('profile', getProfile, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const profileService = {
  getProfile,
  updateProfile
};
