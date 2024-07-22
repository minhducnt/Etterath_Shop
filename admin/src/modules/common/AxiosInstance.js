import Cookies from 'universal-cookie';

import axios from 'axios';

import { jwtDecode } from 'jwt-decode';

import { Helper } from '../../helper/Helper';
import { globalNavigate } from '../../common/components/GlobalHistory';
import { AXIOS_HELPER } from '../../helper/constants/GlobalConstantUtil';

export const baseURL = process.env.REACT_APP_API_URL;
export const publicBaseURL = process.env.REACT_APP_API_URL_PUBLIC;

const cookies = new Cookies();
export const { JWT_AUTHENTICATION, ACCESS_TOKEN, BEARER, SIGN_IN } = AXIOS_HELPER;

function handleAuthError() {
  cookies.remove(JWT_AUTHENTICATION);
  localStorage.removeItem(ACCESS_TOKEN);
  globalNavigate(SIGN_IN);
}

const axiosBase = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosBase.interceptors.request.use(config => {
  const accessTokenJSON = localStorage.getItem(ACCESS_TOKEN);
  const accessToken = JSON.parse(accessTokenJSON);
  const refreshToken = cookies.get(JWT_AUTHENTICATION);

  if (accessToken && !Helper.isTokenExpired(accessToken)) {
    config.headers.Authorization = `${BEARER} ${accessToken}`;
  } else if (!refreshToken && accessToken != null && Helper.isTokenExpired(accessToken)) {
    handleAuthError();
  }

  return config;
});

axiosBase.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = cookies.get(JWT_AUTHENTICATION);
      const isTokenExpired = Helper.isTokenExpired(refreshToken);

      if (refreshToken && !isTokenExpired) {
        try {
          const { data } = await axios.post(`${baseURL}/auth/renew-access-token`, [], {
            'Content-Type': 'application/json',
            Authorization: `${BEARER} ${refreshToken}`
          });

          const { refresh, access } = data;
          if (refresh && access) {
            const decoded = jwtDecode(refresh);
            localStorage.setItem(ACCESS_TOKEN, JSON.stringify(access));
            cookies.set(JWT_AUTHENTICATION, refresh, { expires: new Date(decoded.ExpiredAt * 1000) });
            return axiosBase(originalRequest);
          } else {
            handleAuthError();
          }
        } catch (err) {
          handleAuthError();
        }
      } else {
        handleAuthError();
      }
    }

    if (error.response?.status >= 400 && error.response?.status < 500) {
      console.error('Client error:', error);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error);
    } else {
      console.error('Error:', error);
    }

    return Promise.reject(error);
  }
);

export default axiosBase;
