import { Box, Button, Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';

import React from 'react';

import { useNavigate } from 'react-router-dom';

import '../../styles/NotFound.css';

function Forbidden() {
  const navigate = useNavigate();

  return (
    <Center minHeight="100vh">
      <Stack>
        <Flex flexDirection="column" align="center" justifyItems="center">
          <Flex gap="30px" alignItems="center" flexDirection="column">
            <Heading fontSize="80px">403</Heading>

            <Box backgroundRepeat="no-repeat" minWidth="100vw" className="four_zero_four_bg" />

            <Flex gap="5px" alignItems="center" flexDirection="column">
              <Heading className="h2">Forbidden</Heading>

              <Text fontSize="20px">Sorry, you're not allowed to go beyond this point!</Text>

              <Button onClick={() => navigate(-1)} textDecoration="none" colorScheme="green" className="mt-3">
                Go back
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Stack>
    </Center>
  );
}

export default Forbidden;
