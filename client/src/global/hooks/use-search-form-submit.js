import { useRouter } from 'next/router';

import { useState, useCallback } from 'react';

const useSearchFormSubmit = () => {
    const router = useRouter();

    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = useCallback(
        e => {
            e.preventDefault();

            let route = searchText ? `/search?searchText=${searchText}` : `/`;
            route += category && category !== 'Select Category' ? `&productType=${category}` : '';

            router.push(route, null, { scroll: false });

            setSearchText('');
            setCategory('');
        },
        [router, searchText, category]
    );

    return {
        searchText,
        category,
        setSearchText,
        setCategory,
        handleSubmit
    };
};

export default useSearchFormSubmit;
