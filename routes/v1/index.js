const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const shopRoute = require('./shop.route');
const categoryRoute = require('./category.route');
const itemRoute = require('./item.route');
const warehouseMovementRoute = require('./warehouse_movement.route');
const shopStockMovementRoute = require('./shop_stock_movement.route');
const allStockBalanceRoute = require('./all_stock_balance.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/shops',
    route: shopRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/items',
    route: itemRoute,
  },
  {
    path: '/warehouse_movements',
    route: warehouseMovementRoute,
  },
  {
    path: '/shop_stock_movements',
    route: shopStockMovementRoute,
  },
  {
    path: '/all_stock_balances',
    route: allStockBalanceRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
