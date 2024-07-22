import { useEffect, useMemo } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import Cookies from 'universal-cookie';

import { Helper } from '../helper/Helper';
import { notifyError } from '../helper/Toastify';
import { AXIOS_HELPER } from '../helper/constants/GlobalConstantUtil';
import { authService } from '../modules/services/AuthService';

export const { JWT_AUTHENTICATION, ACCESS_TOKEN } = AXIOS_HELPER;

const ProtectedRoute = () => {
  const cookies = useMemo(() => new Cookies(), []);

  const jwt_accessTokenJSON = localStorage.getItem(ACCESS_TOKEN);
  const jwt_accessToken = JSON.parse(jwt_accessTokenJSON);
  const jwt_refreshToken = cookies.get(JWT_AUTHENTICATION);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (Helper.isTokenExpired(jwt_accessToken)) {
        if (jwt_refreshToken && !Helper.isTokenExpired(jwt_refreshToken)) {
          await authService.refreshToken({ refreshToken: jwt_refreshToken });
        } else {
          endSession();
        }
      }
    };

    const endSession = () => {
      notifyError('Your session has expired. Please sign in again.');
      localStorage.removeItem(ACCESS_TOKEN);
      cookies.remove(JWT_AUTHENTICATION);
    };

    checkAndRefreshToken();
  }, [cookies, jwt_accessToken, jwt_refreshToken]);

  if (!jwt_accessToken || Helper.isTokenExpired(jwt_accessToken)) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
