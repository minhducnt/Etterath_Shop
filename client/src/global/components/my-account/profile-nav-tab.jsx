import React from 'react';

function SingleNav({ active = false, id, title, icon, size = '1rem' }) {
    return (
        <button
            className={`nav-link ${active ? 'active' : ''}`}
            id={`nav-${id}-tab`}
            data-bs-toggle="tab"
            data-bs-target={`#nav-${id}`}
            type="button"
            role="tab"
            aria-controls={id}
            aria-selected={active ? 'true' : 'false'}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-start' }}>
                <i className={icon} style={{ fontSize: size }} />
                <span style={{ alignSelf: 'flex-start' }}>{title}</span>
            </div>
        </button>
    );
}

const ProfileNavTab = () => {
    return (
        <nav>
            <div className="nav nav-tabs tp-tab-menu flex-column" id="profile-tab" role="tablist">
                <SingleNav active={true} id="profile" title="Dashboard" icon="fa-regular fa-user" />
                <SingleNav id="information" title="Information" icon="fa-regular fa-circle-info" />
                <SingleNav id="address" title="My Addresses" icon="fa-regular fa-location-crosshairs" />
                <SingleNav id="order" title="My Orders" icon="fa-regular fa-cart-shopping" size="0.9rem" />
                <SingleNav id="password" title="Change Password" icon="fa-regular fa-lock" />
            </div>
        </nav>
    );
};

export default ProfileNavTab;
