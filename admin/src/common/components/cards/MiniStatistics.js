import { Flex, Stat, StatLabel, StatNumber, useColorModeValue, Text } from '@chakra-ui/react';

import React from 'react';

import { Link } from 'react-router-dom';

import Card from './Card';

export default function Default(props) {
  const { startContent, endContent, name, growth, value, linkTo } = props;

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  return linkTo && linkTo !== null ? (
    <Link to={linkTo}>
      <Card py="15px" className={`card w-full mt-0 p-6 bg-base-100 shadow-md`}>
        <Flex my="auto" h="100%" align="center" justify={{ base: 'center', xl: 'center' }}>
          {startContent}

          <Stat my="auto" ms={startContent ? '18px' : '0px'}>
            <StatLabel
              lineHeight="100%"
              color={textColorSecondary}
              fontSize={{
                base: 'sm'
              }}
              pb="1"
            >
              {name}
            </StatLabel>

            <StatNumber
              color={textColor}
              fontSize={{
                base: 'lg'
              }}
            >
              {value}
            </StatNumber>

            {growth ? (
              <Flex align="center">
                <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
                  {growth}
                </Text>
                <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                  since last month
                </Text>
              </Flex>
            ) : null}
          </Stat>

          <Flex ms="auto" w="max-content">
            {endContent}
          </Flex>
        </Flex>
      </Card>
    </Link>
  ) : (
    <Card py="12px" className={`card w-full mt-0 p-6 bg-base-100 shadow-md`}>
      <Flex my="auto" h="100%" align="center" justify={{ base: 'center', xl: 'center' }}>
        {startContent}

        <Stat my="auto" ms={startContent ? '18px' : '0px'}>
          <StatLabel
            lineHeight="100%"
            color={textColorSecondary}
            fontSize={{
              base: 'sm'
            }}
            pb="1"
          >
            {name}
          </StatLabel>

          <StatNumber
            color={textColor}
            fontSize={{
              base: 'lg'
            }}
          >
            {value}
          </StatNumber>

          {growth ? (
            <Flex align="center">
              <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
                {growth}
              </Text>
              <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                since last month
              </Text>
            </Flex>
          ) : null}
        </Stat>

        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
