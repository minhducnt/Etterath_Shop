import { Box } from '@chakra-ui/react';

import React from 'react';

import { Outlet } from 'react-router-dom';

import Footer from '../common/components/parts/Footer';
import Header from '../common/components/parts/Header';

function ErrorLayout() {
  return (
    <Box className="bg-base-200">
      <Header />
      <Outlet />
      <Footer />
    </Box>
  );
}

export default ErrorLayout;
