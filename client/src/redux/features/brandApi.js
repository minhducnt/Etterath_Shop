import { apiSlice } from '../apis/apiSlice';

export const brandApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getActiveBrands: builder.query({
            query: () => `http://localhost:8000/api/brands`
        }),

        getBrand: builder.query({
            query: id => `http://localhost:8000/api/brands/${id}`
        })
    })
});

export const { useGetActiveBrandsQuery } = brandApi;
