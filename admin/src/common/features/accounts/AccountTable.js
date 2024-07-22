import { Box, useDisclosure } from '@chakra-ui/react';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { AiOutlineEye } from 'react-icons/ai';

import NoDataToDisplay from '../../components/NoDataToDisplay';
import TitleCard from '../../components/cards/TitleCard';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import DynamicTable, { FilterType } from '../../components/tables/DynamicTable';
import { useDynamicService } from '../../../modules/common/ServiceInstance';
import { accountService, useGetListAccount } from '../../../modules/services/AccountService';
import DynamicTopSide from '../../components/tables/topSides/DynamicTopSide';

function AccountTable() {
  // #region Variables
  const navigation = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [switchStatusData, setSwitchStatusData] = useState({});

  const [account, setAccounts] = useState([[]]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  // #endregion

  // #region Hooks
  const { data: listAccountData, isFetching, isLoading } = useGetListAccount();
  const { isOpen: isSwitchStatusOpen, onOpen: onSwitchStatusOpen, onClose: onSwitchStatusClose } = useDisclosure();

  const useUpdateAccountStatus = useDynamicService(accountService.blockAccount, 'listAccount');

  useEffect(() => {
    const accounts = listAccountData?.data?.flat().filter(account => account !== null) ?? [];
    setAccounts(accounts.length > 0 ? accounts : []);
    setFilteredAccounts(accounts.length > 0 ? accounts : []);
  }, [listAccountData]);
  // #endregion

  // #region Methods
  const switchStatusAccount = useCallback(
    row => {
      setSwitchStatusData(row);
      onSwitchStatusOpen();
    },
    [setSwitchStatusData, onSwitchStatusOpen]
  );

  const handleSwitchStatus = useCallback(() => {
    useUpdateAccountStatus.mutate({
      user_id: switchStatusData.id,
      block: !switchStatusData.block_status
    });
    setSwitchStatusData({});
    onSwitchStatusClose();
  }, [switchStatusData, setSwitchStatusData, onSwitchStatusClose, useUpdateAccountStatus]);

  const viewAccountOrders = useCallback(
    row => {
      localStorage.setItem('selectedAccount', JSON.stringify(row));
      navigation(`/app/accounts/${row.id}/orders`);
    },
    [navigation]
  );
  // #endregion

  // #region Search
  const removeFilter = useCallback(() => {
    setFilteredAccounts(account);
  }, [account]);

  const applySearch = useCallback(value => {
    const lowerCaseValue = value.toLowerCase();
    setFilteredAccounts(e =>
      e.filter(
        ({ last_name, first_name }) => last_name.toLowerCase().includes(lowerCaseValue) || first_name.toLowerCase().includes(lowerCaseValue)
      )
    );
  }, []);

  useEffect(() => {
    searchText === '' ? removeFilter() : applySearch(searchText);
  }, [applySearch, removeFilter, searchText]);
  // #endregion

  // #region Tables
  const tableRowAction = [
    {
      actionName: 'View',
      icon: <AiOutlineEye className={`h-5 w-5`} />,
      func: viewAccountOrders,
      isDisabled: true
    }
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
        hidden: true
      },
      {
        Header: 'Avatar',
        accessor: 'google_profile_image',
        textAlign: 'center',
        headerAlgin: 'center',
        hidden: true
      },
      {
        Header: 'User Name',
        accessor: 'user_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'First Name',
        accessor: 'first_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        haveFilter: {
          filterType: FilterType.Text
        },
        haveSort: true
      },
      {
        Header: 'Verified',
        accessor: 'verified',
        cellWidth: '60px',
        textAlign: 'center'
      },
      {
        Header: 'Blocked',
        accessor: 'block_status',
        cellWidth: '60px',
        textAlign: 'center',
        isIcon: false
      }
    ],
    []
  );
  // #endregion

  // #region UI
  if (isLoading || isFetching) return <LoadingSpinner />;
  if (useUpdateAccountStatus.loading) return <LoadingSpinner />;
  return (
    <TitleCard title="Account Management" TopSideButtons={<DynamicTopSide setSearchText={setSearchText} />}>
      <Box marginTop="0px !important">
        {filteredAccounts && filteredAccounts?.length > 0 ? (
          <DynamicTable
            handleSwitchStatus={switchStatusAccount}
            columns={columns}
            data={filteredAccounts}
            tableRowAction={tableRowAction}
            hideAction={false}
          />
        ) : (
          <Box h="65vh">
            <NoDataToDisplay />
          </Box>
        )}
      </Box>
      <ChakraAlertDialog
        isOpen={isSwitchStatusOpen}
        onClose={onSwitchStatusClose}
        onAccept={handleSwitchStatus}
        acceptButtonColor="green"
        acceptButtonLabel="Confirm"
        message={`Are you sure you want to ${switchStatusData?.active === true ? 'block' : 'unblock'} this account?`}
        title={`${switchStatusData?.active === true ? 'Block' : 'Unblock'} this account`}
      />
    </TitleCard>
  );
  // #endregion
}

export default AccountTable;
