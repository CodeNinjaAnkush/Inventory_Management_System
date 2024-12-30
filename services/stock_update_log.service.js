const { StockUpdateLog } = require('../models');

const addStockUpdateLog = async (data, session) => {
  return StockUpdateLog.create([data], { session });
};

module.exports = {
  addStockUpdateLog,
};
