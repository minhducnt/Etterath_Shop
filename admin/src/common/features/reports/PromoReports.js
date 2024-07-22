import { Box, Icon, SimpleGrid } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { AiOutlineTag } from 'react-icons/ai';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import MiniStatistics from '../../components/cards/MiniStatistics';
import TitleCard from '../../components/cards/TitleCard';
import IconBox from '../../components/icons/IconBox';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useGetListOffer } from '../../../modules/services/OfferService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function PromoReportTable() {
  // #region Variables
  const [searchText, setSearchText] = useState('');

  const [promoInProcess, setPromoInProcess] = useState(0);
  const [promoCompleted, setPromoCompleted] = useState(0);

  const [promo, setPromos] = useState([[]]);
  const [filteredPromos, setFilteredPromos] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listPromoData, isFetching, isLoading } = useGetListOffer();

  useEffect(() => {
    const promos = listPromoData?.data?.flat().filter(Boolean) ?? [];
    setPromos(promos.length > 0 ? promos : []);
    setFilteredPromos(promos.length > 0 ? promos : []);

    const inProcess = promos.filter(t => new Date(t.start_date) <= new Date() && new Date(t.end_date) >= new Date()).length;
    const completed = promos.filter(t => new Date(t.end_date) < new Date()).length;

    setPromoInProcess(inProcess);
    setPromoCompleted(completed);
  }, [listPromoData]);
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredPromos(promo);
  }, [promo]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredPromos(e => e.filter(t => t.product_name.toLowerCase().includes(lowerCaseValue)));
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
        hidden: true
      },
      {
        Header: 'Offer',
        accessor: 'offer_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Description',
        accessor: 'description',
        hidden: true
      },
      {
        Header: 'Discount',
        accessor: 'discount_rate',
        haveFilter: {
          filterType: FilterType.Number
        },
        haveSort: true,
        type: 'percent'
      },
      {
        Header: 'Start',
        accessor: 'start_date',
        haveFilter: {
          filterType: FilterType.DateTime
        },
        haveSort: true,
        type: 'dateTime'
      },
      {
        Header: 'Expiry',
        accessor: 'end_date',
        haveFilter: {
          filterType: FilterType.DateTime
        },
        haveSort: true,
        type: 'dateTime'
      }
    ],
    []
  );
  // #endregion

  // #region UI
  if (isFetching || isLoading) return <LoadingSpinner />;
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 2 }} gap="24px" mb="24px" mt="2px">
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="32px" h="32px" as={AiOutlineTag} color={`black`} />} />}
          name="Promo. In Process"
          value={promoInProcess}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="white" icon={<Icon w="32px" h="32px" as={AiOutlineTag} color={`black`} />} />}
          name="Promo. Completed"
          value={promoCompleted}
        />
      </SimpleGrid>

      <TitleCard title={`Promotion Table`} TopSideButtons={<DynamicTopSide setSearchText={setSearchText} />}>
        <Box marginTop="0px !important">
          {filteredPromos && filteredPromos.length > 0 ? (
            <DynamicTable columns={columns} data={filteredPromos} hideAction={true} />
          ) : (
            <Box h="65vh">
              <NoDataToDisplay />
            </Box>
          )}
        </Box>
      </TitleCard>
    </Box>
  );
  // #endregion
}

export default PromoReportTable;
