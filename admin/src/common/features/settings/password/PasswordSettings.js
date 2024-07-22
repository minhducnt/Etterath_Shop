import { LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { Formik } from 'formik';

import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';

import { notifySuccess, notifyError } from '../../../../helper/Toastify';
import TitleCard from '../../../components/cards/TitleCard';
import ChakraAlertDialog from '../../../components/dialog/ChakraAlertDialog';
import AuthTextField from '../../../components/field/AuthTextField';
import LoadingSpinner from '../../../components/loaders/LoadingSpinner';
import { AXIOS_HELPER } from '../../../../helper/constants/GlobalConstantUtil';
import { profileService, useGetProfile } from '../../../../modules/services/ProfileService';

import PasswordTopSideButtons from './PasswordTopSideButtons';

const { ACCESS_TOKEN } = AXIOS_HELPER;

function PasswordSettings() {
  // #region Variables
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // #endregion

  // #region Hooks
  const { isOpen: isSaveDetailAlertOpen, onOpen: onSaveDetailAlertOpen, onClose: onSaveDetailAlertClose } = useDisclosure();
  const { data: profileDetailData, isFetching, isLoading } = useGetProfile();
  const [userData] = profileDetailData?.data || [];

  const useSaveProfileDetail = useMutation(profileService.updateProfile, {
    onSuccess: res => {
      const { message } = res;
      queryClient.invalidateQueries(['profileDetail', userData.id]);
      navigate('/app/dashboard', { replace: true });
      notifySuccess(message);
    },
    onError: error => {
      const { response } = error;
      queryClient.invalidateQueries(['profileDetail', userData.id]);
      notifyError(response.data.message);
    }
  });
  // #endregion

  // #region Fields
  const initialValues = {
    user_name: userData?.user_name ?? '',
    full_name: userData?.full_name ?? '',
    day_of_birth:
      userData?.day_of_birth !== ''
        ? new Date(userData?.day_of_birth).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10),
    email: userData?.email ?? '',
    password: userData?.password ?? ''
  };

  const validationSchema = Yup.object().shape({
    current_password: Yup.string().required('Current password is required'),
    new_password: Yup.string().required('New password is required'),
    password: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
  });
  // #endregion

  // #region UI
  if (isFetching || isLoading) return <LoadingSpinner />;
  if (useSaveProfileDetail.isLoading) return <LoadingSpinner />;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        onSaveDetailAlertClose();

        const profileDetail = {
          user_id: jwtDecode(JSON.parse(localStorage.getItem(ACCESS_TOKEN))).UserID,
          user_name: values?.user_name,
          full_name: values?.full_name,
          day_of_birth: values?.day_of_birth !== '' ? new Date(values?.day_of_birth).toISOString() : '',
          email: values?.email,
          password: values.password
        };

        useSaveProfileDetail.mutate({ profileDetail });
      }}
    >
      {formik => (
        <TitleCard
          title={`Change Password`}
          TopSideButtons={<PasswordTopSideButtons onAddEditOpen={formik.isValid ? onSaveDetailAlertOpen : formik.handleSubmit} />}
        >
          <Box marginTop="0px !important">
            <Stack>
              <>
                <Stack spacing={4}>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <AuthTextField
                      label="Current Password"
                      name="current_password"
                      placeholder="Current password"
                      type="password"
                      leftIcon={<LockIcon />}
                      rightIcon={<ViewOffIcon />}
                      hideIcon={<ViewIcon />}
                    />
                  </Flex>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <AuthTextField
                      label="New Password"
                      name="new_password"
                      placeholder="New password"
                      type="password"
                      leftIcon={<LockIcon />}
                      rightIcon={<ViewOffIcon />}
                      hideIcon={<ViewIcon />}
                      showStrengthBar={true}
                    />
                    <AuthTextField
                      label="Confirm Password"
                      name="password"
                      placeholder="Confirm password"
                      type="password"
                      leftIcon={<LockIcon />}
                      rightIcon={<ViewOffIcon />}
                      hideIcon={<ViewIcon />}
                    />
                  </Flex>
                </Stack>
                <ChakraAlertDialog
                  title="Save profile detail"
                  message="Are you sure? This action will save your profile details."
                  isOpen={isSaveDetailAlertOpen}
                  onClose={onSaveDetailAlertClose}
                  acceptButtonLabel="Confirm"
                  type="submit"
                  onAccept={formik.handleSubmit}
                  acceptButtonColor="green"
                />
              </>
            </Stack>
          </Box>
        </TitleCard>
      )}
    </Formik>
  );
  // #endregion
}

export default PasswordSettings;
