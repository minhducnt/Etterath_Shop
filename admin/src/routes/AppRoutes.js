import { Route, Routes } from 'react-router-dom';

import { lazy } from 'react';

import AuthRoute from './AuthRoutes';
import ProtectedRoute from './ProtectedRoutes';

const Login = lazy(() => import('../pages/auth/SignIn'));
const Register = lazy(() => import('../pages/auth/SignUp'));
const NotExist = lazy(() => import('../pages/error/NotExist'));

const ProtectedLayout = lazy(() => import('../containers/ProtectedLayout'));
const AuthLayout = lazy(() => import('../containers/AuthLayout'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app/*" element={<ProtectedLayout />} />
      </Route>

      <Route>
        <Route path="*" element={<NotExist />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
