import { Box, Flex, Stack, useDisclosure } from '@chakra-ui/react';

import * as Yup from 'yup';

import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { Formik } from 'formik';

import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';

import { notifySuccess, notifyError } from '../../../../helper/Toastify';
import TitleCard from '../../../components/cards/TitleCard';
import ChakraAlertDialog from '../../../components/dialog/ChakraAlertDialog';
import FormTextField from '../../../components/field/FormTextField';
import LoadingSpinner from '../../../components/loaders/LoadingSpinner';
import { AXIOS_HELPER } from '../../../../helper/constants/GlobalConstantUtil';
import { profileService, useGetProfile } from '../../../../modules/services/ProfileService';

import ProfileTopSideButtons from './ProfileTopSideButtons';

const { ACCESS_TOKEN } = AXIOS_HELPER;

function ProfileSettings() {
  // #region Variables
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // #endregion

  // #region Hooks
  const { data: profileDetailData, isFetching, isLoading } = useGetProfile();
  const { isOpen: isSaveDetailAlertOpen, onOpen: onSaveDetailAlertOpen, onClose: onSaveDetailAlertClose } = useDisclosure();
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

  // #region Field
  const initialValues = {
    user_name: userData?.user_name ?? '',
    full_name: userData?.full_name ?? '',
    day_of_birth:
      userData?.day_of_birth !== ''
        ? new Date(userData?.day_of_birth).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10),
    email: userData?.email ?? ''
  };

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required('This field is required'),
    day_of_birth: Yup.date().max(new Date(), 'Your birth date is invalid').required('This field is required'),
    email: Yup.string().email('Invalid email format').required('This field is required')
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
          email: values?.email
        };

        useSaveProfileDetail.mutate({ profileDetail });
      }}
    >
      {formik => (
        <TitleCard
          title={`Personal Information`}
          TopSideButtons={<ProfileTopSideButtons onAddEditOpen={formik.isValid ? onSaveDetailAlertOpen : formik.handleSubmit} />}
        >
          <Box marginTop="0px !important">
            <Stack>
              <>
                <Stack spacing={4}>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField
                      name="user_name"
                      isRequired="true"
                      isReadOnly="true"
                      isDisabled="true"
                      label="User Name"
                      leftIcon={<AiOutlineUser color="#999" fontSize="1.1rem" />}
                    />
                    <FormTextField
                      name="full_name"
                      isRequired="true"
                      label="Full Name"
                      placeholder="Enter your Full Name"
                      leftIcon={<AiOutlineUser color="#999" fontSize="1.1rem" />}
                    />
                  </Flex>
                  <Flex gap={[4, 8]} flexDirection={['column', 'column', 'row']}>
                    <FormTextField name="day_of_birth" isDateField={true} label="Date of Birth" />
                    <FormTextField
                      name="email"
                      isRequired="true"
                      label="Email"
                      type="email"
                      placeholder="abc@gmail.com"
                      leftIcon={<AiOutlineMail color="#999" fontSize="1.1rem" />}
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

export default ProfileSettings;
