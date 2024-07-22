import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/sales';

const getListSale = async ({ start_date, end_date }) => {
  const response = await axiosBase.get(`${endPoint}/?start_date=${start_date}&end_date=${end_date}`, {
    responseType: 'blob'
  });

  const blob = new Blob([response.data], { type: response.headers['content-type'] });

  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;

  link.download = 'etterath_sales_data.csv';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

export const saleService = {
  getListSale
};
