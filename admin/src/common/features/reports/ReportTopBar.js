import { Button, Flex, Stack, Tooltip } from '@chakra-ui/react';

import { AiOutlineDownload } from 'react-icons/ai';

import Datepicker from 'react-tailwindcss-datepicker';

import { useState } from 'react';

import { useMutation } from 'react-query';

import { Helper } from '../../../helper/Helper';
import { notifyError, notifySuccess } from '../../../helper/Toastify';
import { saleService } from '../../../modules/services/SaleService';

const ReportTopBar = () => {
  const [dateValue, setDateValue] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleDatePickerValueChange = newValue => {
    setDateValue(newValue);
  };

  const useDownloadReport = useMutation(saleService.getListSale, {
    onSuccess: res => {
      notifySuccess(res.message);
    },
    onError: error => {
      const { response } = error;

      notifyError(response.data.message);

      if (response && response.data && Array.isArray(response.data.error)) {
        response.data.error.forEach(err => notifyError(Helper.toSentence(err)));
      }
    }
  });

  const onDownloadReport = () => {
    useDownloadReport.mutate({
      start_date: Helper.convertDateISOToYYYYMMDD(dateValue.startDate),
      end_date: Helper.convertDateISOToYYYYMMDD(dateValue.endDate)
    });
  };

  return (
    <Flex align="center" mb="24px">
      <Stack direction="row" spacing={4}>
        <div className={'inline-block'}>
          <div className="input-group relative flex flex-wrap items-stretch w-full">
            <Datepicker
              value={dateValue}
              theme={'light'}
              inputClassName="input input-bordered w-72"
              popoverDirection={'down'}
              toggleClassName="invisible"
              onChange={handleDatePickerValueChange}
              primaryColor={'white'}
            />
          </div>
        </div>

        <Tooltip label="Download Report" hasArrow>
          <Button
            leftIcon={<AiOutlineDownload size={18} />}
            shadow="2xl"
            colorScheme="green"
            fontSize="md"
            height="44px"
            onClick={onDownloadReport}
          >
            Shop Report
          </Button>
        </Tooltip>
      </Stack>
    </Flex>
  );
};

export default ReportTopBar;
