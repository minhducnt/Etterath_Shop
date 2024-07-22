import { apiSlice } from '../apis/apiSlice';

export const categoryApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getCategories: builder.query({
            query: () => `http://localhost:8000/api/categories/`
        }),

        getVariations: builder.query({
            query: categoryId => `http://localhost:8000/api/categories${categoryId}/variations`
        })
    })
});

export const { useGetCategoriesQuery, useGetVariationsQuery } = categoryApi;
