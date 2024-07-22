import { useMutation, useQueryClient } from 'react-query';

import { Helper } from '../../helper/Helper';
import { notifyError, notifySuccess } from '../../helper/Toastify';

export function useDynamicService(serviceFunction, queryKey, isWindowReload = false) {
  const queryClient = useQueryClient();

  const mutation = useMutation(serviceFunction, {
    onSuccess: res => {
      if (isWindowReload) {
        window.location.reload();
      } else {
        queryClient.invalidateQueries(queryKey);
        queryClient.invalidateQueries(queryKey);
      }

      notifySuccess(res.message);
    },
    onError: error => {
      const { response } = error;
      queryClient.invalidateQueries(queryKey);

      notifyError(response.data.message);

      if (response && response.data && Array.isArray(response.data.error)) {
        response.data.error.forEach(err => notifyError(Helper.toSentence(err)));
      }
    }
  });

  return mutation;
}
