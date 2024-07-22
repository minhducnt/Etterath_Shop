import { AtSignIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';

import * as Yup from 'yup';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import Cookies from 'universal-cookie';

import { Formik } from 'formik';

import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';

import { notifyError, notifySuccess } from '../../helper/Toastify';
import { AXIOS_HELPER } from '../../helper/constants/GlobalConstantUtil';
import { emailRegex, usernameRegex } from '../../helper/validations/ValidationRegExp';
import { authService } from '../../modules/services/AuthService';
import AuthTextField from '../../common/components/field/AuthTextField';

import { Helper } from '../../helper/Helper';

export const { JWT_AUTHENTICATION, ACCESS_TOKEN } = AXIOS_HELPER;

function SignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cookies = new Cookies();

  const useLoginMutation = useMutation(authService.login, {
    onSuccess: async data => {
      // Set cookies
      const { refresh_token, access_token } = data.data[0];

      const decoded = jwtDecode(refresh_token);
      cookies.set(JWT_AUTHENTICATION, refresh_token, {
        ExpiresAt: decoded.ExpiresAt
      });

      localStorage.setItem(ACCESS_TOKEN, JSON.stringify(access_token));
      const decodeData = jwtDecode(access_token);
      queryClient.setQueryData(['userDecodeData'], decodeData);

      // Login
      await queryClient.invalidateQueries('userDecodeData');
      navigate('/app/dashboard', { replace: true });
      notifySuccess(data.message);
    },
    onError: error => {
      const { response } = error;
      return notifyError(Helper.toSentence(response.data.error[0]));
    }
  });

  const initialValues = { user_name: '', email: '', password: '' };
  const validationSchema = Yup.object().shape({
    user_name: Yup.string()
      .required('Username is required')
      .test('username', 'Invalid username, email or phone number', function (value) {
        // Assuming emailRegex, phoneRegExp, and usernameRegex are defined elsewhere
        const isValidEmail = emailRegex.test(value);
        const isValidUsername = usernameRegex.test(value) && value.length <= 15;

        // Return true if any of the conditions are met
        return isValidEmail || isValidUsername || new Yup.ValidationError('Invalid username, or email', value, 'username');
      }),
    password: Yup.string().required('Password is required').min(5, 'Password is too short').max(30, 'Password is too long')
  });

  return (
    <Center minHeight="calc(100vh - 160px)" width="100%">
      <Box paddingX="8" paddingY="8" bgColor="white" shadow="2xl" rounded="xl">
        <Stack spacing="6">
          <Flex gap="3" flexDirection="column" alignItems="center">
            <Heading fontSize="xx-large">Admin Panel</Heading>
            <Text fontSize="large">Welcome back!</Text>
          </Flex>
          <Formik
            className="pb-4"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              if (emailRegex.test(values.user_name)) {
                values.email = values.user_name;
                values.user_name = '';
              } else {
                values.email = '';
              }

              useLoginMutation.mutate({
                user_name: values.user_name,
                email: values.email,
                password: values.password
              });
              actions.resetForm();
            }}
          >
            {formik => (
              <Stack spacing="6" as="form" onSubmit={formik.handleSubmit}>
                <AuthTextField
                  label="Username/Email"
                  name="user_name"
                  placeholder="Username/Email"
                  type="text"
                  leftIcon={<AtSignIcon />}
                  isRequired={true}
                />
                <AuthTextField
                  label="Password"
                  name="password"
                  placeholder="Your password"
                  type="password"
                  leftIcon={<LockIcon />}
                  rightIcon={<ViewOffIcon />}
                  hideIcon={<ViewIcon />}
                  isRequired={true}
                />
                <Button
                  className="mt-3"
                  type="submit"
                  bgColor="#1C6758"
                  color="whitesmoke"
                  isLoading={useLoginMutation.isLoading}
                  _hover={{
                    color: '#1C6758',
                    background: 'whitesmoke',
                    border: '1px solid black'
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            )}
          </Formik>
        </Stack>
      </Box>
    </Center>
  );
}

export default SignIn;
