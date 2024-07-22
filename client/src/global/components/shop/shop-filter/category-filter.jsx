import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
// internal
import ErrorMsg from '@/global/components/common/error-msg';
import { useGetCategoriesQuery } from '@/redux/features/categoryApi';
import { handleFilterSidebarClose } from '@/redux/features/shop-filter-slice';
import ShopCategoryLoader from '@/global/components/loader/shop/shop-category-loader';

const CategoryFilter = ({ setCurrPage }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const { data: listCategories, isLoading, isError } = useGetCategoriesQuery();

    useEffect(() => {
        if (listCategories && Array.isArray(listCategories.data)) {
            let result = [];
            listCategories.data.forEach(category => {
                if (category && Array.isArray(category)) {
                    category.forEach(item => {
                        result.push({ category_id: item.category_id, category_name: item.category_name });
                        if (item.sub_category && Array.isArray(item.sub_category)) {
                            item.sub_category.forEach(subItem => {
                                result.push({ category_id: subItem.sub_category_id, category_name: subItem.sub_category_name });
                            });
                        }
                    });
                }
            });

            setCategories(result);
        }
    }, [listCategories]);

    // handle category route
    const handleCategoryRoute = title => {
        setCurrPage(1);
        router.push(`/shop?category=${title.toLowerCase().replace('&', '').split(' ').join('-')}`);
        dispatch(handleFilterSidebarClose());
    };

    let content = null;

    if (isLoading) {
        content = <ShopCategoryLoader loading={isLoading} />;
    }
    if (!isLoading && isError) {
        content = <ErrorMsg msg="Something went wrong! Please try again!" />;
    }
    if (!isLoading && !isError && categories?.length === 0) {
        content = <ErrorMsg msg="No Category found!" />;
    }
    if (!isLoading && !isError && categories?.length > 0) {
        content = categories.map(item => (
            <li key={item.category_id}>
                <a
                    onClick={() => handleCategoryRoute(item.category_name)}
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                    className={
                        router.query.category === item.category_name.toLowerCase().replace('&', '').split(' ').join('-') ? 'active' : ''
                    }
                >
                    {item.category_name}
                </a>
            </li>
        ));
    }

    return (
        <>
            <div className="tp-shop-widget mb-50">
                <h3 className="tp-shop-widget-title">Categories</h3>
                <div className="tp-shop-widget-content">
                    <div className="tp-shop-widget-categories">
                        <ul style={{ textDecoration: 'none' }}>{content}</ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryFilter;
