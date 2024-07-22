import { apiSlice } from '../apis/apiSlice';

export const productApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        //* get all products
        getAllProducts: builder.query({
            query: () => `http://localhost:8000/api/products/`,
            providesTags: ['Products']
        }),

        //* get all product items
        getAllProductItems: builder.query({
            query: id => `http://localhost:8000/api/products/${id}/items/`,
            providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
            invalidatesTags: (result, error, arg) => [{ type: 'RelatedProducts', id: arg }]
        }),

        //* get all product offers
        getAllProductOffers: builder.query({
            query: id => `http://localhost:8000/api/products/offers`,
            providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
            invalidatesTags: (result, error, arg) => [{ type: 'RelatedProducts', id: arg }]
        }),

        //* get all product offers by id
        getAllProductOffersById: builder.query({
            query: id => `http://localhost:8000/api/products/${id}/offers/`,
            providesTags: (result, error, arg) => [{ type: 'Product', id: arg }],
            invalidatesTags: (result, error, arg) => [{ type: 'RelatedProducts', id: arg }]
        }),

        //* get product by id
        getProductById: builder.query({
            query: id => `http://localhost:8000/api/products/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Product', id: arg }]
        })
    })
});

export const {
    useGetAllProductsQuery,
    useGetAllProductItemsQuery,
    useGetAllProductOffersQuery,
    useGetAllProductOffersByIdQuery,
    useGetProductByIdQuery
} = productApi;
