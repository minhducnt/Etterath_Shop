import { Box } from '@chakra-ui/react';

import React from 'react';

import { Outlet } from 'react-router-dom';

import background from '../assets/images/onBackground.png';
import Footer from '../common/components/parts/Footer';
import Header from '../common/components/parts/Header';

function AuthLayout() {
  return (
    <Box backgroundImage={background} backgroundSize="cover">
      <Header />
      <Outlet />
      <Footer />
    </Box>
  );
}

export default AuthLayout;
