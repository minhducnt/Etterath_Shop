import { Box, Flex, Heading, Icon, Spacer, Tooltip } from '@chakra-ui/react';

import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';

import { AiOutlineMenu } from 'react-icons/ai';

import React, { useState } from 'react';

import routes from '../../routes/AppSidebar';

function LeftSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Flex
      justify={collapsed ? 'center' : 'start'}
      alignItems="start"
      className="z-10 shadow-md"
      style={{
        height: '100%',
        width: '100%'
      }}
    >
      <Sidebar
        rootStyles={{ overflowY: 'overlay', backgroundColor: 'bg-base-100' }}
        customBreakPoint="1005px"
        width="240px"
        collapsed={collapsed}
        collapsedWidth="64px"
        breakPoint="md"
      >
        <Menu>
          {!collapsed && (
            <Flex alignItems="center" justifyContent="center" gap="2" padding="4" height="64px">
              <Flex flex="8" alignItems="center" gap="2">
                <Link to={'/app/dashboard'}>
                  <Heading fontSize="x-large" color="#1C6758" overflow="hidden" width="124px" textOverflow="ellipsis" whiteSpace="nowrap">
                    Etterath
                  </Heading>
                </Link>
              </Flex>
              <Spacer />
              <Tooltip placement="right" hasArrow label="Minimize the side bar">
                <Flex flex="1" pl="4px">
                  <Icon onClick={toggleSidebar} cursor="pointer" fontSize="1rem" color="#1C6758" as={AiOutlineMenu} />
                </Flex>
              </Tooltip>
            </Flex>
          )}
          {collapsed && (
            <Flex alignItems="center" justifyContent="center" gap="2" padding="4" bg="#1C6758" height="64px">
              <Tooltip placement="right" hasArrow label="Expand the side bar">
                <Flex pr="4px" pl="4px" pt="4px" pb="4px" justifyContent="center" w="100%">
                  <Icon onClick={toggleSidebar} cursor="pointer" fontSize="1rem" color="white" as={AiOutlineMenu} />
                </Flex>
              </Tooltip>
            </Flex>
          )}
        </Menu>
        <Menu
          menuItemStyles={{
            SubMenuExpandIcon: {
              justifyContent: 'center',
              color: '#1C6758',
              fontSize: '12px'
            },
            button: ({ level, active }) => {
              if (level === 0)
                return {
                  backgroundColor: active ? '#B1D7B4' : [],
                  color: active ? '#D6CDA4' : []
                };
              if (level === 1)
                return {
                  backgroundColor: active ? '#B1D7B4' : [],
                  color: active ? '#D6CDA4' : []
                };
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
                      <Box flex="20%" display="grid" placeItems="start">
                        {parentItem.icon}
                      </Box>
                      {!collapsed && (
                        <Box flex="80%" fontSize="1rem" fontWeight="semibold">
                          {parentItem.name}
                        </Box>
                      )}
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
                            <Box flex="20%" display="grid" placeItems="start">
                              {childItem.icon}
                            </Box>
                            <Box flex="80%" fontSize="0.9rem" fontWeight="semibold" placeItems="center">
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
                    <Box flex="20%" display="grid" placeItems="start">
                      {parentItem.icon}
                    </Box>
                    {!collapsed && (
                      <Box flex="80%" fontSize="1rem" fontWeight="semibold">
                        {parentItem.name}
                      </Box>
                    )}
                  </Flex>
                </MenuItem>
              );
            }
          })}
        </Menu>
      </Sidebar>
      <Box flex="1" backgroundColor="bg-base-100" minWidth="0" minHeight="100vh" backgroundPosition="bottom" backgroundSize="auto">
        <Outlet />
      </Box>
    </Flex>
  );
}

export default LeftSidebar;
