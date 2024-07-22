import Cookies from 'universal-cookie';

import { jwtDecode } from 'jwt-decode';

import axiosBase, { ACCESS_TOKEN, JWT_AUTHENTICATION, SIGN_IN, baseURL } from '../common/AxiosInstance';
import { globalNavigate } from '../../common/components/GlobalHistory';

const endPoint = baseURL + '/auth';
const cookies = new Cookies();

const login = async ({ user_name, email, password }) => {
  const response = await axiosBase.post(`${endPoint}/sign-in/`, { user_name, email, password });
  return response.data;
};

const register = async ({ user_name, email, password }) => {
  const response = await axiosBase.post(`${baseURL}/sign-up/`, { user_name, email, password });
  return response.data;
};

const logout = async () => {
  cookies.remove(JWT_AUTHENTICATION);
  localStorage.clear(ACCESS_TOKEN);
};

const refreshToken = async ({ refresh_token }) => {
  const { data } = await axiosBase.post(`${endPoint}/renew-access-token`, [], {
    Authorization: `Bearer ${refresh_token}`
  });
  const { refresh, access } = data;
  if (refresh && access) {
    const decoded = jwtDecode(refresh);
    localStorage.setItem(ACCESS_TOKEN, JSON.stringify(access));
    cookies.set(JWT_AUTHENTICATION, refresh, { expires: new Date(decoded.exp * 1000) });
  } else {
    cookies.remove(JWT_AUTHENTICATION);
    localStorage.removeItem(ACCESS_TOKEN);
    globalNavigate(SIGN_IN);
  }
};

export const authService = {
  login,
  register,
  logout,
  refreshToken
};
