import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/offers';

//* Offers
const createOffer = async ({ offer_name, description, discount_rate, start_date, end_date }) => {
  const response = await axiosBase.post(`${endPoint}/`, {
    offer_name,
    description,
    discount_rate: parseInt(discount_rate),
    start_date: new Date(start_date).toISOString(),
    end_date: new Date(end_date).toISOString()
  });
  return response.data;
};

const getListOffer = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const deleteOffer = async offer_id => {
  const response = await axiosBase.delete(`${endPoint}/${offer_id}`);
  return response.data;
};

//* Offer Products
const getListOfferProduct = async offer_id => {
  const response = await axiosBase.get(`${endPoint}/${offer_id}/products/`);
  return response.data;
};

const createOfferProduct = async ({ offer_id, product_id }) => {
  const response = await axiosBase.post(`${endPoint}/products`, {
    offer_id: parseInt(offer_id),
    product_id: parseInt(product_id)
  });
  return response.data;
};

const updateOfferProduct = async ({ product_offer_id, offer_id }) => {
  const response = await axiosBase.patch(`${endPoint}/products`, {
    product_offer_id,
    offer_id
  });
  return response.data;
};

const deleteOfferProduct = async ({ offer_product_id }) => {
  const response = await axiosBase.delete(`${endPoint}/products/${offer_product_id}`);
  return response.data;
};

export const useGetListOffer = () => {
  return useQuery('listOffer', getListOffer, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListOfferProduct = id => {
  return useQuery(['listOfferProduct', id], () => getListOfferProduct(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const offerService = {
  createOffer,
  deleteOffer,
  createOfferProduct,
  updateOfferProduct,
  deleteOfferProduct
};
