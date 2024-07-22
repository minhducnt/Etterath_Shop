import { lazy } from 'react';

const AccountOrders = lazy(() => import('../pages/home/account/AccountOrders'));
const Accounts = lazy(() => import('../pages/home/account/Accounts'));
const Brands = lazy(() => import('../pages/home/product/Brands'));
const Categories = lazy(() => import('../pages/home/product/Categories'));
const CategoryOptions = lazy(() => import('../pages/home/product/Options'));
const CategorySubCategories = lazy(() => import('../pages/home/product/SubCategories'));
const CategoryVariants = lazy(() => import('../pages/home/product/Variants'));
const Coupons = lazy(() => import('../pages/home/promotion/Coupons'));
const Dashboard = lazy(() => import('../pages/home/Dashboard'));
const ModelAdditional = lazy(() => import('../pages/home/product/Additional'));
const ModelDescription = lazy(() => import('../pages/home/product/Description'));
const ModelDetails = lazy(() => import('../pages/home/product/Details'));
const ModelItems = lazy(() => import('../pages/home/product/Items'));
const Models = lazy(() => import('../pages/home/product/Models'));
const OfferProducts = lazy(() => import('../pages/home/promotion/OfferProducts'));
const Offers = lazy(() => import('../pages/home/promotion/Offers'));
const OrderDetails = lazy(() => import('../pages/home/logistic/OrderDetails'));
const OrderItems = lazy(() => import('../pages/home/logistic/OrderItems'));
const Orders = lazy(() => import('../pages/home/logistic/Orders'));
const Passwords = lazy(() => import('../pages/home/user/ChangePassword'));
const Payments = lazy(() => import('../pages/home/Payments'));
const PnLReports = lazy(() => import('../pages/home/report/PnLReport'));
const PSIReports = lazy(() => import('../pages/home/report/PSIReport'));
const Profile = lazy(() => import('../pages/home/user/Profile'));
const PromoReports = lazy(() => import('../pages/home/report/PromoReport'));
const Stocks = lazy(() => import('../pages/home/logistic/Stocks'));

const routes = [
  //* Home
  {
    path: '/dashboard',
    component: Dashboard
  },

  //* Accounts
  {
    path: '/accounts',
    component: Accounts
  },
  {
    path: '/accounts/:accountId/orders',
    component: AccountOrders
  },

  //* Products
  {
    path: '/categories',
    component: Categories
  },
  {
    path: '/categories/:categoryId/sub-categories',
    component: CategorySubCategories
  },
  {
    path: '/categories/:categoryId/variants',
    component: CategoryVariants
  },
  {
    path: '/categories/:categoryId/variants/:variantId/options',
    component: CategoryOptions
  },
  {
    path: '/brands',
    component: Brands
  },
  {
    path: '/models',
    component: Models
  },
  {
    path: '/models/:productId/items',
    component: ModelItems
  },
  {
    path: '/models/:productId/description',
    component: ModelDescription
  },
  {
    path: '/models/:productId/additional',
    component: ModelAdditional
  },

  //* Logistics
  {
    path: '/orders',
    component: Orders
  },
  {
    path: '/orders/:shopOrderId/items',
    component: OrderItems
  },
  {
    path: 'orders/:shopOrderId/details',
    component: OrderDetails
  },
  {
    path: '/stocks',
    component: Stocks
  },

  //* Promotion
  {
    path: '/offers',
    component: Offers
  },
  {
    path: '/offers/:offerId/products',
    component: OfferProducts
  },
  {
    path: '/coupons',
    component: Coupons
  },

  //* Others
  {
    path: '/payments',
    component: Payments
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/change-password',
    component: Passwords
  },

  //* Report
  {
    path: '/reports/psi',
    component: PSIReports
  },
  {
    path: '/reports/pnl',
    component: PnLReports
  },
  {
    path: '/reports/pnl/models/:productId',
    component: ModelDetails
  },
  {
    path: '/reports/pnl/models/:productId/description',
    component: ModelDescription
  },
  {
    path: '/reports/pnl/models/:productId/additional',
    component: ModelAdditional
  },
  {
    path: '/reports/promo',
    component: PromoReports
  }
];

export default routes;
