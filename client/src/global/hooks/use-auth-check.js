import { useGetUserQuery } from '@/redux/features/auth/authApi';
import { userLoggedIn, userProfile } from '@/redux/features/auth/authSlice';

import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import Cookies from 'js-cookie';

function useAuthCheck() {
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);

    // Retrieve and parse the userAuth cookie once
    const userAuth = Cookies.get('userAuth') ? JSON.parse(Cookies.get('userAuth')) : {};
    const { accessToken, refreshToken } = userAuth;

    // Use optional chaining to simplify access to userData
    const { data: userData, isSuccess } = useGetUserQuery(undefined, { skip: !accessToken });

    useEffect(() => {
        if (accessToken) {
            dispatch(userLoggedIn({ accessToken, refreshToken }));

            if (isSuccess && userData?.data?.[0]) {
                dispatch(userProfile({ user: userData.data[0] }));
            }
        }

        setAuthChecked(true);
    }, [dispatch, accessToken, refreshToken, isSuccess, userData]);

    return authChecked;
}

export default useAuthCheck;
