import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';

import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { MdArrowLeft, MdArrowRight, MdSkipNext, MdSkipPrevious } from 'react-icons/md';

import React, { useEffect, useState } from 'react';

import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

import { FiMoreVertical } from 'react-icons/fi';

import IndeterminateCheckbox from '../IndeterminateCheckbox';
import NoDataToDisplay from '../NoDataToDisplay';
import AvatarWithPreview from '../image/AvatarWithPreview';
import ItemListWithPreview from '../image/ItemListWithPreview';
import ItemWithPreview from '../image/ItemWithPreview';
import { Helper } from '../../../helper/Helper';
import ChakraAlertDialog from '../../components/dialog/ChakraAlertDialog';

const numberType = [
  'Is Greater Than Or Equal To',
  'Is Greater Than',
  'Is Less Than Or Equal To',
  'Is Less Than',
  'Is Equal To',
  'Is Not Equal To'
];
const textType = ['Start With', 'End With'];
const dateTimeType = ['Is Before Or Equal To', 'Is Before', 'Is After Or Equal To', 'Is After'];
const defaultType = ['Contains', 'Does Not Contains', 'Is Empty', 'Is Not Empty'];

export const FilterType = {
  Number: {
    type: 'number',
    array: numberType
  },
  Text: {
    type: 'text',
    array: textType
  },
  DateTime: {
    type: 'dateTime',
    array: dateTimeType
  },
  Default: {
    type: 'text',
    array: defaultType
  }
};

const iconClasses = `h-32 w-32`;

function DynamicTable(props) {
  const { data, columns, handleDeleteRange, handleSwitchStatus, tableRowAction, hideReset, hideDeleteRange, noPaging, hideAction } = props;
  const { isOpen: isDeleteRangeOpen, onOpen: onDeleteRangeOpen, onClose: onDeleteRangeClose } = useDisclosure();

  const handleDeleteRangeAlertAccept = () => {
    onDeleteRangeClose();
    handleDeleteRange(selectedFlatRows);
  };

  const {
    headerGroups,
    rows,
    page,
    selectedFlatRows,
    nextPage,
    previousPage,
    gotoPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
    getTableProps,
    getTableBodyProps,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    hooks => {
      hooks?.visibleColumns?.push(columns => [
        {
          id: 'action',
          Header: ({ getToggleAllRowsSelectedProps, hideDeleteRange }) => {
            if (hideAction) {
              return null;
            }

            return (
              <Flex gap="8px">
                <Box>{hideDeleteRange && <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />}</Box>
                <Box display="flex" justifyContent="center" alignItems="center" width={12}>
                  <Text color="white" fontWeight="medium" fontSize="md">
                    Action
                  </Text>
                </Box>
              </Flex>
            );
          },
          Cell: ({ row }) => {
            if (hideAction) {
              return <Box width="0px" />;
            }

            if (tableRowAction?.length === 1 && tableRowAction[0].actionName === 'Edit') {
              return (
                <Tooltip label="Edit" hasArrow>
                  <Box display="flex" justifyContent="center" alignItems="center" width={'60px'}>
                    <IconButton
                      aria-label={tableRowAction[0].actionName}
                      icon={tableRowAction[0].icon}
                      colorScheme="green"
                      variant="outline"
                      onClick={() => {
                        tableRowAction[0].func(row?.values, tableRowAction[0].actionName);
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            }

            if (tableRowAction?.length === 1 && tableRowAction[0].actionName === 'Delete') {
              return (
                <Tooltip label="Delete" hasArrow>
                  <Box display="flex" justifyContent="center" alignItems="center" width={'60px'}>
                    <IconButton
                      aria-label={tableRowAction[0].actionName}
                      icon={tableRowAction[0].icon}
                      colorScheme="red"
                      variant="outline"
                      bg="rgba(255, 0, 0, 0.1)"
                      onClick={() => {
                        tableRowAction[0].func(row?.values, tableRowAction[0].actionName);
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            }

            if (tableRowAction?.length === 1 && tableRowAction[0].actionName === 'View') {
              return (
                <Tooltip label="View" hasArrow>
                  <Box display="flex" justifyContent="center" alignItems="center" width={'60px'}>
                    <IconButton
                      aria-label={tableRowAction[0].actionName}
                      icon={tableRowAction[0].icon}
                      colorScheme="green"
                      variant="outline"
                      bg="rgba(0, 255, 0, 0.1)"
                      onClick={() => {
                        tableRowAction[0].func(row?.values, tableRowAction[0].actionName);
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            }

            return (
              <Box display="flex" justifyContent="center" alignItems="center" width={'60px'}>
                <Menu isLazy>
                  <MenuButton
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={'#1C6758'}
                    as={IconButton}
                    aria-label="Options"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <Icon as={FiMoreVertical} />
                  </MenuButton>
                  <MenuList minWidth="160px">
                    {tableRowAction?.map(item => (
                      <MenuItem
                        isDisabled={!item?.isDisabled}
                        key={item.actionName}
                        icon={item.icon}
                        iconSpacing={4}
                        onClick={() => {
                          item.func(row?.values, item.actionName);
                        }}
                        style={{ padding: '16px' }}
                      >
                        {item.actionName}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            );
          }
        },
        ...columns
      ]);
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const initialData = columns.reduce((col, curr) => {
    const { accessor, haveFilter } = curr;
    if (!haveFilter) return { ...col };
    const filterType = haveFilter?.filterType.type || 'default';
    const initialValue = filterType === 'number' ? -1 : '';
    return {
      ...col,
      [accessor]: {
        value: initialValue,
        sorterType: '',
        filterType: haveFilter?.filterType.array[0]
      }
    };
  }, {});

  const [pagingObject, setPagingObject] = useState({
    paging: {
      pageSize: pageSize,
      pageNumber: pageIndex + 1,
      totalElements: 999
    },
    filterAndSorter: initialData
  });

  const handleSort = (column, value) => {
    setPagingObject(prev => {
      let updatedFilterAndSorter = { ...prev.filterAndSorter };
      column.toggleSortBy();
      for (let key in updatedFilterAndSorter) {
        if (updatedFilterAndSorter[key].sorterType !== '') {
          updatedFilterAndSorter[key].sorterType = '';
        }
      }
      updatedFilterAndSorter[column.id].sorterType = value;
      return { ...prev, filterAndSorter: updatedFilterAndSorter };
    });
  };

  const handleReset = () => {
    setPagingObject({
      paging: {
        pageSize: pageSize,
        pageNumber: pageIndex + 1
      },
      filterAndSorter: initialData
    });
    setPageSize(pageSize);
    gotoPage(0);
  };

  useEffect(() => {
    setPagingObject(prev => {
      let updatedFilterAndSorter = { ...prev.paging };
      updatedFilterAndSorter.pageNumber = pageIndex;
      return { ...prev, paging: updatedFilterAndSorter };
    });
  }, [pageIndex]);

  useEffect(() => {
    setPagingObject(prev => {
      let updatedFilterAndSorter = { ...prev.paging };
      updatedFilterAndSorter.pageSize = pageSize;
      return { ...prev, paging: updatedFilterAndSorter };
    });
  }, [pageSize]);

  useEffect(() => {}, [pagingObject]);

  return (
    <Stack marginTop="0px !important">
      {/* Table */}
      <TableContainer rounded="lg" display="block">
        <Table variant="striped" {...getTableProps()} size="sm">
          <Thead bgColor="primary2">
            {headerGroups?.map((headerGroup, index) => {
              const { key, ...headerGroupProps } = headerGroup?.getHeaderGroupProps();
              return (
                <Tr key={key} {...headerGroupProps}>
                  {headerGroup?.headers?.map((column, columnIndex) => {
                    if (columnIndex !== 0) {
                      const { key: columnKey, ...columnProps } = column?.getHeaderProps();
                      return (
                        <Th
                          key={columnKey}
                          bg="#1C6758"
                          color="white"
                          w={column?.headerWidth || 'none'}
                          display={column?.hidden ? 'none' : 'undefine'}
                          fontSize="1.05rem"
                          textTransform="capitalize"
                          {...columnProps}
                        >
                          <Flex alignItems="center" gap="5px" justifyContent={column?.headerAlign || 'start'}>
                            <Text color="white" fontWeight="medium" fontSize="md">
                              {column?.Header}
                            </Text>
                            {column?.haveSort && (
                              <Flex color="white" cursor="pointer" flexDirection="column">
                                {column?.isSorted ? (
                                  column?.isSortedDesc ? (
                                    <Icon
                                      onClick={e => {
                                        column?.getSortByToggleProps();
                                        handleSort(column, '');
                                      }}
                                      boxSize="16px"
                                      as={FaSortDown}
                                    />
                                  ) : (
                                    <Icon
                                      onClick={e => {
                                        column?.getSortByToggleProps();
                                        handleSort(column, 'des');
                                      }}
                                      boxSize="16px"
                                      as={FaSortUp}
                                    />
                                  )
                                ) : (
                                  <Icon
                                    onClick={e => {
                                      column?.getSortByToggleProps();
                                      handleSort(column, 'asc');
                                    }}
                                    boxSize="16px"
                                    as={FaSort}
                                  />
                                )}
                              </Flex>
                            )}
                          </Flex>
                        </Th>
                      );
                    }
                    const { key: columnKey, ...columnProps } = column?.getHeaderProps();
                    return (
                      <Th
                        key={columnKey}
                        bg="#1C6758"
                        color="white"
                        display={column?.hidden ? 'none' : 'undefine'}
                        fontSize="1.05rem"
                        h="40px"
                        textTransform="capitalize"
                        {...columnProps}
                      >
                        {column?.render('Header')}
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>

          <Tbody bgColor="white" {...getTableBodyProps()}>
            {rows?.length > 0 &&
              page?.map((row, index) => {
                prepareRow(row);
                const { key: rowKey, ...rowProps } = row?.getRowProps();
                return (
                  <Tr key={rowKey} {...rowProps}>
                    {row?.cells?.map(cell => {
                      const { key: cellKey, ...cellProps } = cell?.getCellProps();
                      return (
                        <Td key={cellKey} {...cellProps} display={cell?.column?.hidden ? 'none' : 'undefine'}>
                          <Box
                            width={cell?.column?.cellWidth || 'none'}
                            textAlign={cell?.column?.textAlign || 'none'}
                            textOverflow="ellipsis"
                            overflow="hidden"
                            fontSize="md"
                            fontWeight="normal"
                            className={hideAction && 'pt-4 pb-4'}
                          >
                            {(cell => {
                              if (cell?.column?.type === 'dateTime' && !isNaN(Date.parse(cell?.value))) {
                                return (
                                  <Text fontSize="sm" fontWeight="normal">
                                    {Helper.getMomentDateFormat(cell?.value)}
                                  </Text>
                                );
                              } else if (cell?.column?.type === 'percent' && cell?.column?.id === 'discount_rate') {
                                return (
                                  <Text fontSize="sm" fontWeight="normal">
                                    {cell?.value} %
                                  </Text>
                                );
                              } else if (cell?.column?.id === 'google_profile_image') {
                                return (
                                  <Flex>
                                    <AvatarWithPreview alt="avatar" altBoxSize="35px" boxSize="70px" src={cell?.value} />
                                  </Flex>
                                );
                              } else if (cell?.column?.id === 'image') {
                                return (
                                  <Flex>
                                    <ItemWithPreview alt="item" altBoxSize="96px" boxSize="96px" src={cell?.value} />
                                  </Flex>
                                );
                              } else if (cell?.column?.id === 'images') {
                                if (cell?.value?.length === 1) {
                                  return (
                                    <Flex>
                                      <ItemWithPreview alt="item" altBoxSize="96px" boxSize="96px" src={cell?.value[0]} />
                                    </Flex>
                                  );
                                } else {
                                  return (
                                    <Flex>
                                      <ItemListWithPreview alt="items" altBoxSize="96px" boxSize="96px" src={cell?.value} />
                                    </Flex>
                                  );
                                }
                              } else if (typeof cell?.value === 'boolean') {
                                return (
                                  <Box display="flex" justifyContent="center" alignItems="center">
                                    {cell?.column?.isIcon === true ? (
                                      <Icon
                                        as={cell?.value ? AiFillCheckCircle : AiFillCloseCircle}
                                        color={cell?.value ? 'green' : '#949494'}
                                        boxSize={5}
                                      />
                                    ) : cell?.column?.id === 'block_status' ? (
                                      <Switch
                                        isChecked={cell?.value}
                                        colorScheme="teal"
                                        size="md"
                                        onChange={() => handleSwitchStatus(cell?.row?.original)}
                                      />
                                    ) : (
                                      <Icon
                                        as={cell?.value ? AiFillCheckCircle : AiFillCloseCircle}
                                        color={cell?.value ? 'green' : '#949494'}
                                        boxSize={5}
                                      />
                                    )}
                                  </Box>
                                );
                              } else if (
                                cell?.column?.id === 'maximum_amount' ||
                                cell?.column?.id === 'minimum_cart_price' ||
                                cell?.column?.id === 'price' ||
                                cell?.column?.id === 'order_total_price' ||
                                cell?.column?.id === 'sub_total' ||
                                cell?.column?.id === 'discount_price' ||
                                cell?.column?.id === 'puscharge_price' ||
                                cell?.column?.id === 'profit' ||
                                cell?.column?.id === 'cost' ||
                                cell?.column?.id === 'discount' ||
                                cell?.column?.id === 'refund_amount'
                              ) {
                                return cell?.render('Cell', {
                                  value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cell?.value)
                                });
                              } else if (cell?.column?.id === 'sub_category' || cell?.column?.id === 'options') {
                                return cell?.render('Cell', {
                                  value: cell?.value?.map(item => item?.sub_category_name || item?.variation_value).join(', ')
                                });
                              } else if (cell?.column?.id === 'variation_values') {
                                return cell?.render('Cell', {
                                  value: cell?.value?.map(item => item?.variation_name).join(', ')
                                });
                              } else if (cell?.column?.id === 'shop_order_id') {
                                return cell?.render('Cell', {
                                  value: `#${cell?.value}`
                                });
                              } else {
                                return cell?.render('Cell');
                              }
                            })(cell)}
                          </Box>
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            {Array.isArray(data) && data.length === 0 && (
              <Tr>
                <Td>
                  <NoDataToDisplay />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Toolbar */}
      <HStack display="flex" width="100%" className="tool-bar" alignItems="center" gap="10px" marginTop="24px">
        <HStack display="flex" flex="1" alignItems="center">
          {!hideReset & !hideDeleteRange && (
            <Flex minWidth="max-content" alignItems="center" gap="2">
              <Flex gap={2}>
                <Box w="10px" bg="green.700" borderRadius="5px" />
                <Text fontWeight="semibold" fontSize="md">
                  {pageIndex + 1}/{pageCount} {pageCount > 1 ? 'pages' : 'page'}
                </Text>
              </Flex>
            </Flex>
          )}
          {hideReset && (
            <Tooltip placement="top" hasArrow label="Reset table paging">
              <Button shadow="2xl" colorScheme="green" onClick={handleReset}>
                Reset
              </Button>
            </Tooltip>
          )}
          {hideDeleteRange && (
            <Tooltip placement="top" hasArrow label="Delete a collection of record">
              <Button onClick={onDeleteRangeOpen} isDisabled={selectedFlatRows.length < 2} colorScheme="green">
                Delete Range
              </Button>
            </Tooltip>
          )}
          <ChakraAlertDialog
            isOpen={isDeleteRangeOpen}
            onClose={onDeleteRangeClose}
            onAccept={handleDeleteRangeAlertAccept}
            title={`Delete ${rows.length === selectedFlatRows.length ? 'All' : ''} ${selectedFlatRows.length} items`}
          />
        </HStack>

        {!noPaging && (
          <HStack
            spacing="10px"
            display="flex"
            gap="10px"
            flex="1"
            marginLeft="0px !important"
            alignItems="center"
            flexDirection={{
              base: 'column',
              md: 'row'
            }}
            justifyContent={{
              base: 'flex-start',
              md: 'flex-end'
            }}
          >
            {/* Paging */}
            <HStack marginRight="5px !important">
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                shadow="2xl"
                fontSize="medium"
              >
                <Icon as={MdSkipPrevious} className={iconClasses} />
              </Button>
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => previousPage()}
                isDisabled={!canPreviousPage}
                shadow="2xl"
                fontSize="medium"
              >
                <Icon as={MdArrowLeft} className={iconClasses} />
              </Button>
              <Button colorScheme="green" size="sm" onClick={() => nextPage()} isDisabled={!canNextPage} shadow="2xl" fontSize="medium">
                <Icon as={MdArrowRight} className={iconClasses} />
              </Button>
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => gotoPage(pageCount - 1)}
                isDisabled={!canNextPage}
                shadow="2xl"
                fontSize="medium"
              >
                <Icon as={MdSkipNext} className={iconClasses} />
              </Button>
            </HStack>
          </HStack>
        )}
      </HStack>
    </Stack>
  );
}

export default DynamicTable;
