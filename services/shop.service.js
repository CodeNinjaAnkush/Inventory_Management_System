const httpStatus = require('http-status');
const { Shop } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a shop
 * @param {Object} shopBody
 * @returns {Promise<Shop>}
 */
const createShop = async (shopBody) => {
  return Shop.create(shopBody);
};

/**
 * Query for shops
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryShops = async (filter, options) => {
  const shops = await Shop.paginate(filter, options);
  return shops;
};

/**
 * Get shop by id
 * @param {ObjectId} id
 * @returns {Promise<Shop>}
 */
const getShopById = async (id) => {
  return Shop.findById(id);
};


/**
 * Get shop by id
 * @param {ObjectId} id
 * @returns {Promise<Shop>}
 */
const getShopByCode = async (code) => {
  return Shop.findOne({ shop_code: code });
};


/**
 * Get shop by email
 * @param {string} email
 * @returns {Promise<Shop>}
 */
const getShopByEmail = async (email) => {
  return Shop.findOne({ email });
};

/**
 * Update shop by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Shop>}
 */
const updateShopById = async (userId, updateBody) => {
  const shop = await getShopById(userId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  Object.assign(shop, updateBody);
  await shop.save();
  return shop;
};

/**
 * Delete shop by id
 * @param {ObjectId} userId
 * @returns {Promise<Shop>}
 */
const deleteUserById = async (userId) => {
  const shop = await getShopById(userId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  await shop.remove();
  return shop;
};

module.exports = {
  createShop,
  queryShops,
  getShopById,
  getShopByEmail,
  updateShopById,
  deleteUserById,
  getShopByCode
};
