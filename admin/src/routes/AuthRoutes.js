import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthRoute = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default AuthRoute;
