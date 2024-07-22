import { Box, Button, Center, Flex, Heading, Stack } from '@chakra-ui/react';

import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import '../../styles/NotFound.css';
import { setPageTitle } from '../../modules/store/common/HeaderSlice';

function NotFound() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: '' }));
  }, [dispatch]);

  const navigate = useNavigate();

  return (
    <Center minHeight="65vh">
      <Stack>
        <Flex flexDirection="column" align="center" justifyItems="center">
          <Flex gap="30px" alignItems="center" flexDirection="column">
            <Heading fontSize="80px">404</Heading>

            <Box backgroundRepeat="no-repeat" className="four_zero_four_bg" />

            <Heading className="h3">Oops, this page couldn't be found</Heading>

            <Button onClick={() => navigate(-1)} textDecoration="none" colorScheme="green">
              Go back
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </Center>
  );
}

export default NotFound;
