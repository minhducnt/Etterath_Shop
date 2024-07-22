import { Center, Spinner } from '@chakra-ui/react';

import React from 'react';

function LoadingSpinner() {
  const centerStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'white' };

  return (
    <Center style={centerStyle}>
      <Spinner thickness="4px" speed="0.65s" emptyColor="#f9f9f9" color="blue.500" size="xl" />
    </Center>
  );
}

export default LoadingSpinner;
