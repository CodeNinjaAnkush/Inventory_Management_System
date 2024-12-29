const httpStatus = require('http-status');
const { Item } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an item
 * @param {Object} itemBody
 * @returns {Promise<Item>}
 */
const createItem = async (itemBody) => {
  return Item.create(itemBody);
};

/**
 * Query items
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryItems = async (filter, options) => {
  return Item.paginate(filter, options);
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Item>}
 */
const getItemById = async (id) => {
  return Item.findById(id).populate('category');
};

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<Item>}
 */
const updateItemById = async (itemId, updateBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

/**
 * Delete item by id
 * @param {ObjectId} itemId
 * @returns {Promise<Item>}
 */
const deleteItemById = async (itemId) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  await item.remove();
  return item;
};

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
