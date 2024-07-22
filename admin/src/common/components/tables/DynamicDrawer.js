import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Flex,
  Box,
  Stack,
  Button,
  HStack,
  Heading
} from '@chakra-ui/react';

import React, { useRef } from 'react';

import { AiOutlineCloseCircle, AiFillCheckCircle } from 'react-icons/ai';

import { Formik } from 'formik';

import FormTextField from '../field/FormTextField';

function DynamicDrawer(props) {
  const {
    isAddEditOpen,
    onAddEditClose,
    editData,
    setEditData,
    initialValues,
    validationSchema,
    drawerFieldData,
    position,
    size,
    handleEdit,
    handleCreate,
    handleCustomAction,
    titleArray,
    disableSubmit,
    customEditTitle,
    isCustomAction,
    hideAction
  } = props;
  const btnRef = useRef();

  const handleClose = () => {
    setEditData({});
    onAddEditClose();
  };

  return (
    <Drawer isOpen={isAddEditOpen} placement={position ?? 'right'} onClose={handleClose} finalFocusRef={btnRef} size={size ?? 'sm'}>
      <DrawerOverlay />
      <DrawerContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (isCustomAction) {
              handleCustomAction(values);
            } else if (Object.keys(editData).length > 0) {
              handleEdit(values);
            } else {
              handleCreate(values);
            }
            actions.resetForm();
          }}
        >
          {formik => (
            <Stack display="flex" as="form" onSubmit={formik.handleSubmit}>
              {/* Header */}
              <DrawerHeader borderBottomWidth="1px">
                <HStack display="flex" width="100%" className="tool-bar" alignItems="center" justifyContent="center" gap="10px">
                  <HStack display="flex" flex="0" alignItems="center">
                    <Flex minWidth="max-content" alignItems="center" gap="2">
                      <Flex gap={2}>
                        <Box w="10px" bg="green.700" borderRadius="5px" />
                        <Heading flex="1" fontSize="2xl">
                          {titleArray
                            ? Object.keys(editData).length > 0
                              ? titleArray[0]
                              : titleArray[1]
                            : Object.keys(editData).length > 0
                            ? customEditTitle ?? 'Edit'
                            : 'Create New'}
                        </Heading>
                      </Flex>
                    </Flex>
                  </HStack>

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
                    {!hideAction && (
                      <HStack marginRight="5px !important">
                        <Button
                          leftIcon={<AiOutlineCloseCircle size={18} className="mt-0.5" />}
                          variant="outline"
                          onClick={handleClose}
                          size="md"
                          shadow="2xl"
                          fontSize="xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          leftIcon={<AiFillCheckCircle size={18} className="mt-0.5" />}
                          type="submit"
                          colorScheme="green"
                          isDisabled={disableSubmit ? true : false}
                          size="md"
                          shadow="2xl"
                          fontSize="xs"
                        >
                          Save
                        </Button>
                      </HStack>
                    )}
                  </HStack>
                </HStack>
              </DrawerHeader>

              {/* Body */}
              <DrawerBody overflowY="auto" maxHeight="calc(100vh - 200px)" minHeight="calc(100vh - 100px)">
                <Stack display="flex" onSubmit={formik.handleSubmit} spacing={3}>
                  {drawerFieldData && drawerFieldData.map(item => <FormTextField formik={formik} key={item.name} {...item} />)}
                </Stack>
              </DrawerBody>
            </Stack>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
}

export default DynamicDrawer;
