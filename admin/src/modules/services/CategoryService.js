import { useQuery } from 'react-query';

import axiosBase, { baseURL } from '../common/AxiosInstance';

const endPoint = baseURL + '/categories';

const getListCategory = async () => {
  const response = await axiosBase.get(`${endPoint}/`);
  return response.data;
};

const getCategoryVariants = async id => {
  const response = await axiosBase.get(`${endPoint}/${id}/variations/`);
  return response.data;
};

const getCategoryOptions = async (category_id, variation_id) => {
  const response = await axiosBase.get(`${endPoint}/${category_id}/variations/${variation_id}/options/`);
  return response.data;
};

const createCategory = async category => {
  const response = await axiosBase.post(`${endPoint}/`, category);
  return response.data;
};

const createSubCategory = async values => {
  const { category_id, category_name } = values;
  const response = await axiosBase.post(`${endPoint}/sub-categories`, { category_id, category_name });
  return response.data;
};

const createCategoryVariant = async ({ category_id, variation_names }) => {
  const variationNamesInput = variation_names.split(', ');
  const response = await axiosBase.post(`${endPoint}/${category_id}/variations/`, { variation_names: variationNamesInput });
  return response.data;
};

const updateCategory = async ({ category_id, category_name }) => {
  const response = await axiosBase.put(`${endPoint}/${category_id}`, { category_name });
  return response.data;
};

const deleteCategory = async category_id => {
  const response = await axiosBase.delete(`${endPoint}/${category_id}`);
  return response.data;
};

const updateCategoryVariant = async ({ category_id, variation_id, variation_name }) => {
  const response = await axiosBase.put(`${endPoint}/${category_id}/variations/${variation_id}`, { variation_name });
  return response.data;
};

const deleteCategoryVariant = async ({ category_id, variation_id }) => {
  const response = await axiosBase.delete(`${endPoint}/${category_id}/variations/${variation_id}`);
  return response.data;
};

const createCategoryVariantOption = async ({ category_id, variation_id, variation_value }) => {
  const variationNamesInput = variation_value?.split(', ');
  const response = await axiosBase.post(`${endPoint}/${category_id}/variations/${variation_id}/options/`, {
    variation_value: variationNamesInput
  });
  return response.data;
};

const updateCategoryVariantOption = async ({ category_id, variation_id, option_id, variation_value }) => {
  const response = await axiosBase.put(`${endPoint}/${category_id}/variations/${variation_id}/options/${option_id}`, {
    variation_value
  });
  return response.data;
};

const deleteCategoryVariantOption = async ({ category_id, variation_id, option_id }) => {
  const response = await axiosBase.delete(`${endPoint}/${category_id}/variations/${variation_id}/options/${option_id}`);
  return response.data;
};

export const useGetListCategory = () => {
  return useQuery('listCategory', getListCategory, {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetCategoryVariants = id => {
  return useQuery(['listVariant', id], () => getCategoryVariants(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGetCategoryOptions = (category_id, variation_id) => {
  return useQuery(['listOption', category_id, variation_id], () => getCategoryOptions(category_id, variation_id), {
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const categoryService = {
  createCategory,
  createCategoryVariant,
  createCategoryVariantOption,
  createSubCategory,
  deleteCategory,
  deleteCategoryVariant,
  deleteCategoryVariantOption,
  getCategoryOptions,
  getCategoryVariants,
  getListCategory,
  updateCategory,
  updateCategoryVariant,
  updateCategoryVariantOption,
  useGetListCategory
};
