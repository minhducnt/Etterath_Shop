import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Heading,
  HStack,
  Stack,
  Flex,
  IconButton,
  useMediaQuery,
  DrawerHeader
} from '@chakra-ui/react';

import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

import { Link, useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { AiOutlineMenu, AiOutlineSetting, AiOutlineLock, AiOutlineLogout } from 'react-icons/ai';

import Cookies from 'universal-cookie';

import dayjs from 'dayjs';

import { useMutation } from 'react-query';

import { NavLink, useLocation } from 'react-router-dom';

import { notifySuccess } from '../../helper/Toastify';
import routes from '../../routes/AppSidebar';
import { ACCESS_TOKEN, JWT_AUTHENTICATION, SIGN_IN } from '../../modules/common/AxiosInstance';
import { authService } from '../../modules/services/AuthService';
import { useGetProfile } from '../../modules/services/ProfileService';
import { setUser } from '../../modules/store/AuthSlice';
import ChakraAlertDialog from '../../common/components/dialog/ChakraAlertDialog';
import AvatarWithPreview from '../../common/components/image/AvatarWithPreview';
import LoadingSpinner from '../../common/components/loaders/LoadingSpinner';

function Header() {
  // #region Variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cookies = new Cookies();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const [userAvatar, setUserAvatar] = useState();

  const { pageTitle } = useSelector(state => state.header);
  // #endregion

  // #region Hooks
  const { data: profileDetailData, isFetching: isFetchingProfileDetailData, isLoading: isLoadingProfileDetailData } = useGetProfile();
  const { isOpen: isSignOutAlertOpen, onOpen: onSignOutAlertOpen, onClose: onSignOutAlertClose } = useDisclosure();

  const useLogoutMutation = useMutation(authService.logout, {
    onSuccess: () => {
      cookies.remove(JWT_AUTHENTICATION);
      dispatch(setUser(null));
      navigate(SIGN_IN);
      notifySuccess('Sign out successfully');
    },
    onError: error => console.log(error)
  });

  const handleLogout = () => {
    const accessTokenJSON = localStorage.getItem(ACCESS_TOKEN);
    const access_token = JSON.parse(accessTokenJSON);
    const refresh_token = cookies.get(JWT_AUTHENTICATION);
    useLogoutMutation.mutate({ access_token, refresh_token });
  };

  useEffect(() => {
    const googleProfileImage = profileDetailData?.data?.flat()?.[0]?.google_profile_image;
    setUserAvatar(googleProfileImage ? `${googleProfileImage}?${dayjs()}` : undefined);
  }, [profileDetailData]);
  // #endregion

  // #region UI
  if (useLogoutMutation.isLoading || isFetchingProfileDetailData || isLoadingProfileDetailData) return <LoadingSpinner />;
  return (
    <Box className="navbar flex justify-between z-10 shadow-md" bg="#1C6758">
      <Box className="text-center">
        {!isLargerThan768 && (
          <IconButton
            className="btn btn-menu drawer-button lg:hidden"
            bg={'transparent'}
            size="lg"
            onClick={toggleSidebar}
            color={'white'}
            _hover={{ color: 'lightgrey' }}
            icon={<AiOutlineMenu style={{ margin: 'auto' }} />}
          />
        )}
        <Heading size="md" color="white" ml={2}>
          {pageTitle}
        </Heading>

        <Drawer isOpen={collapsed} placement="left" onClose={toggleSidebar} size="xs" p={0}>
          <DrawerOverlay />

          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <HStack display="flex" width="100%" className="tool-bar" alignItems="center" justifyContent="center" gap="10px">
                <HStack display="flex" flex="0" alignItems="center">
                  <Flex minWidth="max-content" alignItems="center" gap="2">
                    <Flex gap={2}>
                      <Box w="10px" bg="green.700" borderRadius="5px" />
                      <Heading flex="1" fontSize="2xl">
                        {'Etterath'}
                      </Heading>
                    </Flex>
                  </Flex>
                </HStack>

                <HStack display="flex" flex="1" alignItems="center" justifyContent="center"></HStack>
              </HStack>
            </DrawerHeader>

            <DrawerBody overflowY="auto" maxHeight="calc(100vh - 120px)">
              <Stack align="stretch" display="flex">
                <Menu
                  menuItemStyles={{
                    SubMenuExpandIcon: {
                      justifyContent: 'center',
                      color: '#1C6758',
                      fontSize: '12px'
                    }
                  }}
                >
                  {routes.map((parentItem, index) => {
                    if (parentItem.children) {
                      return (
                        <SubMenu
                          key={index}
                          label={
                            <Flex alignItems="center" justifyContent="start">
                              <Box flex="20%" display="grid" placeItems="start" p={0}>
                                {parentItem.icon}
                              </Box>
                              <Box flex="80%" fontSize="1rem" fontWeight="semibold" p={0}>
                                {parentItem.name}
                              </Box>
                            </Flex>
                          }
                        >
                          {parentItem.children &&
                            parentItem.children.map((childItem, index) => {
                              return (
                                <MenuItem
                                  active={location.pathname === `/${childItem.path}` ? true : false}
                                  key={index}
                                  component={<NavLink to={`${childItem.path}`} />}
                                >
                                  <Flex alignItems="center">
                                    <Box flex="20%" display="grid" placeItems="start" p={0}>
                                      {childItem.icon}
                                    </Box>
                                    <Box flex="80%" fontSize="0.9rem" fontWeight="semibold" placeItems="center" p={0}>
                                      {childItem.name}
                                    </Box>
                                  </Flex>
                                </MenuItem>
                              );
                            })}
                        </SubMenu>
                      );
                    } else {
                      return (
                        <MenuItem
                          active={location.pathname === `app/${parentItem.path}` ? true : false}
                          key={index}
                          component={<NavLink to={parentItem.path} />}
                        >
                          <Flex alignItems="center" justifyContent="start">
                            <Box flex="20%" display="grid" placeItems="start" p={0}>
                              {parentItem.icon}
                            </Box>
                            <Box flex="80%" fontSize="1rem" fontWeight="semibold" p={0}>
                              {parentItem.name}
                            </Box>
                          </Flex>
                        </MenuItem>
                      );
                    }
                  })}
                </Menu>
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      <div className="order-last">
        {/* Profile icon, opening menu on click */}
        <div className="dropdown dropdown-end ml-2">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <Flex pr="4px" pl="4px" pt="4px" pb="4px">
              <AvatarWithPreview alt="avatar" altBoxSize="35px" src={userAvatar} />
            </Flex>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-0 p-2 shadow bg-base-100 rounded-box w-52">
            <li className="justify-between">
              <Link to={'/app/profile'}>
                <AiOutlineSetting className="inline-block mr-2" />
                Profile
              </Link>
            </li>
            <li className="justify-between">
              <Link to={'/app/change-password'}>
                <AiOutlineLock className="inline-block mr-2" />
                Change Password
              </Link>
            </li>
            <div className="divider mt-0 mb-0"></div>
            <li>
              <button onClick={onSignOutAlertOpen} className="text-green-500 bold hover:text-green hover:no-underline cursor-pointer">
                <AiOutlineLogout className="inline-block mr-2" />
                Logout
              </button>
              <ChakraAlertDialog
                title="Sign out account"
                message="Are you sure? This action will sign out your account."
                isOpen={isSignOutAlertOpen}
                onClose={onSignOutAlertClose}
                onAccept={handleLogout}
                acceptButtonLabel="Accept"
                acceptButtonColor="green"
              />
            </li>
          </ul>
        </div>
      </div>
    </Box>
    // #endregion
  );
}

export default Header;
