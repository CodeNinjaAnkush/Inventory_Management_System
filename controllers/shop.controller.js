const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shopService } = require('../services');

const createShop = catchAsync(async (req, res) => {
  const shop = await shopService.createShop(req.body);
  res.status(httpStatus.CREATED).send(shop);
});

const getShops = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await shopService.queryShops(filter, options);
  res.send(result);
});

const getShop = catchAsync(async (req, res) => {
  const shop = await shopService.getShopById(req.params.shopId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  res.send(shop);
});

const updateShop = catchAsync(async (req, res) => {
  const shop = await shopService.updateShopById(req.params.shopId, req.body);
  res.send(shop);
});

const deleteShop = catchAsync(async (req, res) => {
  await shopService.deleteShopById(req.params.shopId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
};
