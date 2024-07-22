import { Box, Image, SimpleGrid, Text, VStack } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import TitleCard from '../../components/cards/TitleCard';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import { useGetProfile } from '../../../modules/services/ProfileService';
import orderImg from '../../../assets/images/dashboard/order.png';
import productImg from '../../../assets/images/dashboard/product.png';
import promotionImg from '../../../assets/images/dashboard/promotion.png';
import reportImg from '../../../assets/images/dashboard/report.png';
import stockImg from '../../../assets/images/dashboard/stock.png';
import subdealerImg from '../../../assets/images/dashboard/subdealer.png';

const CARD_ITEMS = [
  {
    imgUrl: promotionImg,
    title: 'Promotions',
    description: 'Display promotion information and are classified by promotion type',
    target: '/app/offers'
  },
  {
    imgUrl: orderImg,
    title: 'Orders',
    description: 'Display order information and are classified by order status',
    target: '/app/orders'
  },
  {
    imgUrl: productImg,
    title: 'Products',
    description: 'Display product information and are classified by product type',
    target: '/app/models'
  },
  {
    imgUrl: subdealerImg,
    title: 'Accounts',
    description: 'Display account information and are classified by account type',
    target: '/app/accounts'
  },
  {
    imgUrl: stockImg,
    title: 'Stocks',
    description: 'Display account information and are classified by account type',
    target: '/app/stocks'
  },
  {
    imgUrl: reportImg,
    title: 'Reports',
    description: 'Display report information and are classified by report type',
    target: '/app/reports/pnl'
  }
];

const Dashboard = () => {
  // #region Variables
  const navigate = useNavigate();

  const [userName, setUserName] = useState();
  const { data: profileDetailData, isFetching, isLoading } = useGetProfile();
  // #endregion

  // #region Hooks
  useEffect(() => {
    const fullName = profileDetailData?.data?.flat()?.[0]?.full_name;
    setUserName(fullName || 'User');
  }, [profileDetailData]);
  // #endregion

  // #region UI
  if (isFetching || isLoading)
    return (
      <Box h="100vh" w="100vw">
        <LoadingSpinner />
      </Box>
    );
  return (
    <TitleCard title={`Good morning ${userName}`}>
      <Box marginTop="0px !important">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} className="pt-2">
          {CARD_ITEMS.map((item, idx) => (
            <Box
              as="button"
              key={idx}
              onClick={() => navigate(item.target, { replace: true })}
              boxShadow="lg"
              p="4"
              rounded="md"
              bg="white"
              _hover={{ bg: '#f9f9f9', bgImg: 'linear-gradient(180deg, #f7fafc 10%, #edf2f7 100%)' }}
              transition="transform .2s"
              _active={{ transform: 'scale(0.97)' }}
            >
              <Box overflow="hidden" bg={item.bgColor} display="flex" justifyContent="center" alignItems="center">
                <Image alt="image" src={item.imgUrl} width="100%" height="90px" objectFit="contain" className="pb-2" />
              </Box>
              <VStack align="center" spacing={5} className="my-3">
                <Text fontWeight="bold" fontSize="lg">
                  {item.title}
                </Text>
                <Text align="center" fontSize="sm">
                  {item.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </TitleCard>
  );
  // #endregion
};

export default Dashboard;
