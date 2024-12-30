const { StockDailyMovement } = require("../models");

const addStockDailyMovement = async (data, session) => {
  return StockDailyMovement.create([data], { session });
};

module.exports = {
  addStockDailyMovement,
};
