const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { allStockBalanceService } = require("../services");

const getDetail = catchAsync(async (req, res) => {
  const { item, shop } = req.query;
  const stockBalance = await allStockBalanceService.getStockByItem(item, shop);
  if (!stockBalance) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stock Balance not found");
  }
  res.send(stockBalance);
});

module.exports = {
  getDetail,
};
