import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/coupons';

const createCoupon = async ({ coupon_name, description, expire_date, discount_rate, minimum_cart_price, image }) => {
  const formData = new FormData();

  formData.append('coupon_name', coupon_name);
  formData.append('description', description);
  formData.append('expire_date', new Date(expire_date).toISOString());
  formData.append('discount_rate', parseInt(discount_rate));
  formData.append('minimum_cart_price', parseInt(minimum_cart_price));
  formData.append('image', image);
  formData.append('block_status', false);

  const response = await axiosBase.post(`${endPoint}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const getListCoupon = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const updateCoupon = async ({
  coupon_id,
  coupon_name,
  description,
  expire_date,
  discount_rate,
  minimum_cart_price,
  image,
  block_status
}) => {
  const formData = new FormData();

  formData.append('coupon_name', coupon_name);
  formData.append('description', description);
  formData.append('expire_date', new Date(expire_date).toISOString());
  formData.append('discount_rate', parseInt(discount_rate));
  formData.append('minimum_cart_price', parseInt(minimum_cart_price));
  formData.append('image', image);
  formData.append('block_status', block_status);

  const response = await axiosBase.put(`${endPoint}/${coupon_id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const useGetListCoupon = () => {
  return useQuery('listCoupon', getListCoupon, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const couponService = {
  getListCoupon,
  createCoupon,
  updateCoupon
};
