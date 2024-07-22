import React from 'react';
import Link from 'next/link';
// internal
import menu_data from '@/global/data/menu-data';

const Menus = () => {
    return (
        <ul style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {menu_data.map(menu =>
                menu.homes ? (
                    <li key={menu.id}>
                        <Link href={menu.link} style={{ textDecoration: 'none' }}>
                            {menu.title}
                        </Link>
                    </li>
                ) : menu.sub_menu ? (
                    <li key={menu.id} className="has-dropdown">
                        <Link href={menu.link} style={{ textDecoration: 'none' }}>
                            {menu.title}
                        </Link>
                        <ul className="tp-submenu">
                            {menu.sub_menus.map((b, i) => (
                                <li key={i}>
                                    <Link href={b.link}>{b.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ) : (
                    <li key={menu.id}>
                        <Link href={menu.link} style={{ textDecoration: 'none' }}>
                            {menu.title}
                        </Link>
                    </li>
                )
            )}
        </ul>
    );
};

export default Menus;
