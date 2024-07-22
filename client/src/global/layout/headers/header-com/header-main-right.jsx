import Link from 'next/link';
import Image from 'next/image';
// internal
import { User } from '@svgs';
import { useSelector } from 'react-redux';

const HeaderMainRight = () => {
    const { user: userAuth } = useSelector(state => state.auth);
    const { user } = userAuth || {};

    const userContent = () => {
        if (user?.google_profile_image) {
            return (
                <Link href="/profile">
                    <Image src={user.google_profile_image} alt="user img" width={35} height={35} priority/>
                </Link>
            );
        } else if (user?.first_name) {
            return (
                <Link href="/profile" style={{ textDecoration: 'none' }}>
                    <h2 className="text-uppercase login_text">{user.first_name.charAt(0)}</h2>
                </Link>
            );
        } else {
            return (
                <Link href="/login">
                    <User />
                </Link>
            );
        }
    };

    return (
        <div className="tp-header-main-right d-flex align-items-center justify-content-end">
            <div className="tp-header-login d-none d-lg-block">
                <div className="d-flex align-items-center">
                    <div className="tp-header-login-icon">
                        <span>{userContent()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderMainRight;
