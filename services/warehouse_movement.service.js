const { WarehouseMovement } = require("../models");

const createWarehouseMovement = async (data, session) => {
  return WarehouseMovement.create([data], { session });
};

const updateWarehouseMovement = async (id, updateData, session) => {
  return WarehouseMovement.findByIdAndUpdate(id, updateData, {
    new: true,
    session,
  });
};

/**
 * Query categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWarehouseMovements = async (filter, options) => {
  options.populate = 'shop_movement,user,shop,item';
  return WarehouseMovement.paginate(filter, options);
};

module.exports = {
  createWarehouseMovement,
  updateWarehouseMovement,
  queryWarehouseMovements,
};
