const { ShopStockMovement } = require("../models");

const createShopStockMovement = async (data, session) => {
  return ShopStockMovement.create([data], { session });
};

/**
 * Query categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryShopStockMovements = async (filter, options) => {
  options.populate = "warehouse_movement,user,shop,item";
  return ShopStockMovement.paginate(filter, options);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getById = async (id) => {
  return ShopStockMovement.findById(id);
};

const updateShopStockMovement = async (id, updateData, session) => {
  return ShopStockMovement.findByIdAndUpdate(id, updateData, {
    new: true,
    session,
  });
};

module.exports = {
  createShopStockMovement,
  queryShopStockMovements,
  getById,
  updateShopStockMovement,
};
