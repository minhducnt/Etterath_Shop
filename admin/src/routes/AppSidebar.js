import {
  AiOutlineDesktop,
  AiOutlineGold,
  AiOutlineAppstore,
  AiOutlineHome,
  AiOutlineTag,
  AiOutlineTags,
  AiOutlineFire,
  AiOutlineProduct,
  AiOutlineTruck,
  AiOutlineGift,
  AiOutlineTeam,
  AiOutlineDeploymentUnit,
  AiOutlineCreditCard,
  AiOutlinePieChart,
  AiOutlineLineChart,
  AiOutlineCalendar,
  AiFillTruck
} from 'react-icons/ai';

const iconClasses = `h-4 w-4`;
const submenuIconClasses = `h-4 w-4`;

const routes = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    icon: <AiOutlineHome className={iconClasses} />
  },
  {
    path: 'accounts',
    name: 'Accounts',
    icon: <AiOutlineTeam className={iconClasses} />
  },
  {
    name: 'Products',
    icon: <AiOutlineProduct className={iconClasses} />,
    children: [
      {
        path: 'categories',
        name: 'Categories',
        icon: <AiOutlineAppstore className={submenuIconClasses} />
      },
      {
        path: 'brands',
        name: 'Brands',
        icon: <AiOutlineFire className={submenuIconClasses} />
      },
      {
        path: 'models',
        name: 'Products',
        icon: <AiOutlineDesktop className={submenuIconClasses} />
      }
    ]
  },
  {
    name: 'Logistics',
    icon: <AiOutlineGold className={iconClasses} />,
    children: [
      {
        path: 'orders',
        name: 'Orders',
        icon: <AiOutlineTruck className={submenuIconClasses} />
      },
      {
        path: 'stocks',
        name: 'Stocks',
        icon: <AiOutlineDeploymentUnit className={submenuIconClasses} />
      }
    ]
  },
  {
    name: 'Promotions',
    icon: <AiOutlineTags className={iconClasses} />,
    children: [
      {
        path: 'offers',
        name: 'Offers',
        icon: <AiOutlineGift className={submenuIconClasses} />
      },

      {
        path: 'coupons',
        name: 'Coupons',
        icon: <AiOutlineTag className={submenuIconClasses} />
      }
    ]
  },
  {
    name: 'Reports',
    icon: <AiOutlinePieChart className={iconClasses} />,
    children: [
      {
        path: 'reports/psi',
        name: 'PSI Report',
        icon: <AiFillTruck className={iconClasses} />
      },
      {
        path: 'reports/pnl',
        name: 'PnL Report',
        icon: <AiOutlineLineChart className={iconClasses} />
      },
      {
        path: 'reports/promo',
        name: 'Promotion Report',
        icon: <AiOutlineCalendar className={submenuIconClasses} />
      }
    ]
  },
  {
    path: 'payments',
    name: 'Payment Methods',
    icon: <AiOutlineCreditCard className={iconClasses} />
  }
];

export default routes;
