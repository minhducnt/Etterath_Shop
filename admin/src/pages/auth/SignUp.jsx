import { AtSignIcon, LockIcon, StarIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack, Text, useDisclosure } from '@chakra-ui/react';

import React, { useState } from 'react';

import { Formik } from 'formik';

import { useMutation } from 'react-query';

import { Link, useNavigate } from 'react-router-dom';

import * as Yup from 'yup';

import { notifyError, notifySuccess } from '../../helper/Toastify';
import { authService } from '../../modules/services/AuthService';
import ChakraAlertDialog from '../../common/components/dialog/ChakraAlertDialog';
import AuthTextField from '../../common/components/field/AuthTextField';

const SignUp = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formValues, setFormValues] = useState(null);

  const useRegisterMutation = useMutation(authService.register, {
    onSuccess: data => {
      const { message } = data;
      notifySuccess(message);
      navigate('/sign-in');
    },
    onError: error => {
      const { response } = error;
      notifyError(response.data.message);
    }
  });

  const handleRegister = () => {
    const { ...rest } = formValues;
    useRegisterMutation.mutate({
      ...rest
    });
  };

  const initialValues = {
    user_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    user_name: Yup.string('Please enter a valid username')
      .min(0, 'Username is too short')
      .max(15, 'Username is too long')
      .required('User Name required'),
    email: Yup.string().email('Invalid Email').required('Email required'),
    password: Yup.string().required('Password is required').min(5, 'Password is too short').max(30, 'Password is too long'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  return (
    <Center minHeight="calc(100vh - 160px)" width="100%">
      <Box paddingX="6" paddingY="6" bgColor="whitesmoke" shadow="2xl" rounded="xl" p={5} borderWidth="1px">
        <Stack spacing={4}>
          <Flex gap="3" flexDirection="column" alignItems="center">
            <Heading fontSize="xx-large">Admin Panel</Heading>
            <Text fontSize="large">Create your account!</Text>
          </Flex>

          <Formik
            className="pb-4"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              setFormValues(values);
              onOpen();
              actions.resetForm();
            }}
          >
            {formik => (
              <Stack spacing="6" as="form" onSubmit={formik.handleSubmit}>
                <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                  <AuthTextField label="User Name" name="user_name" placeholder="abc" leftIcon={<StarIcon />} isRequired={true} />
                </Flex>
                <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                  <AuthTextField label="Email" name="email" placeholder="abc@gmail.com" leftIcon={<AtSignIcon />} isRequired={true} />
                </Flex>
                <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                  <AuthTextField
                    label="Password"
                    name="password"
                    placeholder="********"
                    type="password"
                    leftIcon={<LockIcon />}
                    rightIcon={<ViewIcon />}
                    hideIcon={<ViewOffIcon />}
                    isRequired={true}
                  />
                  <AuthTextField
                    label="Confirm password"
                    name="confirmPassword"
                    placeholder="********"
                    type="password"
                    leftIcon={<LockIcon />}
                    rightIcon={<ViewIcon />}
                    hideIcon={<ViewOffIcon />}
                    isRequired={true}
                  />
                </Flex>
                <Button
                  type="submit"
                  bgColor="#1C6758"
                  color="whitesmoke"
                  isLoading={useRegisterMutation.isLoading}
                  _hover={{
                    color: 'black',
                    background: 'whitesmoke',
                    border: '1px solid black'
                  }}
                >
                  Sign up
                </Button>
              </Stack>
            )}
          </Formik>

          <Flex justifyContent="center" gap="1">
            <Text>You have register already? </Text>
            <Link to="/sign-in">
              <span style={{ fontWeight: 'bold' }}>Sign in Now</span>
            </Link>
          </Flex>

          <ChakraAlertDialog
            isOpen={isOpen}
            onClose={onClose}
            onAccept={handleRegister}
            acceptButtonColor="green"
            acceptButtonLabel={`Confirm`}
            message={`Are you sure you want to register this account?`}
            title={`Notification`}
          />
        </Stack>
      </Box>
    </Center>
  );
};

export default SignUp;
