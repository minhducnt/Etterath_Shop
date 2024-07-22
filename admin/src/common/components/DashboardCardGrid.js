import { Card, CardBody, SimpleGrid, Box, Flex, Center, Image } from '@chakra-ui/react';

import React from 'react';

import Subtitle from './typography/Subtitle';
import Title from './typography/Title';

function DashboardCardGrid({ dashboardData }) {
  return (
    <SimpleGrid spacing={4} gridTemplateColumns="repeat(auto-fit, minmax(325px,1fr))" className="mt-2">
      {dashboardData &&
        dashboardData.map((item, index) => (
          <Card shadow="2xl" key={index}>
            <CardBody color="black">
              <Flex flexDirection="row" minWidth="max-content" alignItems="center" gap="2">
                <Center w="100px">
                  <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden" p="6" bg={item.bgColor}>
                    <Image alt="icon" src={item.icon} boxSize="52px" />
                  </Box>
                </Center>
                <Center>
                  <Flex flexDirection="column" gap="10px" p={1}>
                    <Flex gap="10px" w="fit-content">
                      <Box w="10px" bg="green.700" borderRadius="5px" />
                      <Title>{item.title}</Title>
                    </Flex>
                    <Flex flexDirection="row">
                      <Subtitle styleClass="text-left mr-2">Status:</Subtitle>
                      <div
                        className="text-left mr-2 text-xl font-bold"
                        style={{ fontWeight: 'bold', color: item.isActive ? 'green' : 'red' }}
                      >
                        {item.isActive ? 'RUNNING' : 'DEAD'}
                      </div>
                    </Flex>
                  </Flex>
                </Center>
              </Flex>
            </CardBody>
          </Card>
        ))}
    </SimpleGrid>
  );
}

export default DashboardCardGrid;
