import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/products';

const getListProduct = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const getProductById = async id => {
  const response = await axiosBase.get(`${endPoint}/${id}`);
  return response.data;
};

const createProduct = async ({ product_name, description, category_id, price, puscharge_price, brand_id, sub_category_id, images }) => {
  const formData = new FormData();

  sub_category_id ? formData.append('category_id', sub_category_id) : formData.append('category_id', category_id);

  formData.append('name', product_name);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('puscharge_price', puscharge_price);
  formData.append('brand_id', brand_id);
  formData.append('properties', ' ');

  if (images) {
    for (let image of images) {
      formData.append('images', image);
    }
  }

  const response = await axiosBase.post(`${endPoint}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const updateProduct = async ({
  product_id,
  product_name,
  description,
  category_id,
  price,
  puscharge_price,
  brand_id,
  images,
  properties
}) => {
  const formData = new FormData();

  formData.append('name', product_name);
  formData.append('description', description);
  formData.append('category_id', category_id);
  formData.append('price', price);
  formData.append('puscharge_price', puscharge_price);
  formData.append('brand_id', brand_id);
  formData.append('properties', properties);

  if (images) {
    for (let image of images) {
      formData.append('images', image);
    }
  }

  const response = await axiosBase.put(`${endPoint}/${product_id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

const getListProductItem = async id => {
  const response = await axiosBase.get(`${endPoint}/${id}/items/`);
  return response.data;
};

const createProductItem = async ({ product_id, qty_in_stock, variation_option_ids, sku }) => {
  const formData = new FormData();

  formData.append('qty_in_stock', parseInt(qty_in_stock));
  formData.append('sku', sku);

  if (Array.isArray(variation_option_ids)) {
    for (let id of variation_option_ids) {
      formData.append('variation_option_ids', id);
    }
  } else {
    formData.append('variation_option_ids', variation_option_ids);
  }

  const response = await axiosBase.post(`${endPoint}/${product_id}/items/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const useGetListProduct = () => {
  return useQuery('listProduct', getListProduct, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetProductById = id => {
  return useQuery(['product', id], () => getProductById(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetListProductItem = id => {
  return useQuery(['listProductItem', id], () => getListProductItem(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const productService = {
  getListProduct,
  createProduct,
  updateProduct,
  getListProductItem,
  createProductItem
};
