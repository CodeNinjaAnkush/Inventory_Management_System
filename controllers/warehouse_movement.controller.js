const mongoose = require("mongoose");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");
const {
  warehouseMovementService,
  allStockBalanceService,
  stockDailyMovementService,
  stockUpdateLogService,
  shopStockMovementService,
} = require("../services");

const createStockIn = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemId, quantity, unitPrice, remark } = req.body;

    const stockBalance = await allStockBalanceService.getStockByItem(
      itemId,
      null
    );
    const currentBalance = stockBalance ? stockBalance.stock_balance : 0;
    const warehouseMovement =
      await warehouseMovementService.createWarehouseMovement(
        {
          stock_type: "In",
          user: req.user.id,
          item: itemId,
          stock_balance: currentBalance,
          quantity,
          unit_price: unitPrice,
          total_price: quantity * unitPrice,
          remark,
          status: "Approved",
        },
        session
      );

    const allStockBalance = await allStockBalanceService.updateOrCreateBalance(
      {
        item: itemId,
        shop: null,
        quantity,
        unitPrice,
      },
      session
    );

    const stockDailyMovement =
      await stockDailyMovementService.addStockDailyMovement(
        {
          item: itemId,
          shop: null,
          stockin_qty: quantity,
          stock_balance: allStockBalance.stock_balance,
          unitprice: unitPrice,
        },
        session
      );

    await stockUpdateLogService.addStockUpdateLog(
      {
        item: itemId,
        shop: null,
        stockin_qty: quantity,
        old_stockbalance: allStockBalance.previous_balance,
        old_stockin_qty: allStockBalance.previous_stockin,
        old_unitprice: allStockBalance.previous_unitprice,
        stock_balance: allStockBalance.stock_balance,
        unitprice: unitPrice,
        created_by: req.user.id,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    res.status(httpStatus.CREATED).send({
      message: "Stock-in successfully recorded.",
      warehouseMovement,
      allStockBalance,
      stockDailyMovement,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error, error);
  }
});

const createStockOut = catchAsync(async (req, res) => {
  const { shopId, itemId, quantity, unitPrice, remark } = req.body;

  const stockBalance = await allStockBalanceService.getStockByItem(
    itemId,
    null
  );
  if (!stockBalance || stockBalance.available_balance < quantity) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: `Insufficient stock. Available balance in warehouse is ${
        stockBalance?.available_balance || 0
      }.`,
    });
  } else {
    const userId = req.user.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const warehouseMovement =
        await warehouseMovementService.createWarehouseMovement(
          {
            stock_type: "Out",
            user: userId,
            shop: shopId,
            item: itemId,
            stock_balance: stockBalance.stock_balance,
            quantity,
            unit_price: stockBalance.unitprice,
            total_price: quantity * stockBalance.unitprice,
            remark,
            status: "Pending",
          },
          session
        );

      const shopStockBalance = await allStockBalanceService.getStockByItem(
        itemId,
        shopId
      );
      const currentBalance = shopStockBalance ? shopStockBalance.stock_balance : 0;
      const shopStockMovement =
        await shopStockMovementService.createShopStockMovement(
          {
            warehouse_movement: warehouseMovement[0]._id,
            stock_type: "In",
            user: null,
            shop: shopId,
            item: itemId,
            entry_datetime: Date(),
            stock_balance: currentBalance,
            quantity,
            unit_price: stockBalance.unitprice,
            total_price: quantity * stockBalance.unitprice,
            remark,
            status: "Pending",
          },
          session
        );
      
      await warehouseMovementService.updateWarehouseMovement(
        warehouseMovement[0]._id,
        { shop_movement: shopStockMovement[0]._id },
        session
      );

      await allStockBalanceService.updateStockBalance(
        stockBalance.id,
        {
          pending_stockout_qty: stockBalance.pending_stockout_qty + quantity,
          available_balance: stockBalance.available_balance - quantity,
        },
        session
      );

      await allStockBalanceService.updateOrCreateBalanceForShop(
        {
          item: itemId,
          shop: shopId,
          quantity,
          unitPrice: stockBalance.unitprice,
        },
        session
      );

      await session.commitTransaction();
      session.endSession();

      res.status(httpStatus.CREATED).send({
        message: "Stock-out successfully recorded.",
        warehouseMovement,
        shopStockMovement,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Transaction failed",
        error
      );
    }
  }
});

const getWarehouseMovements = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status", "stock_type"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await warehouseMovementService.queryWarehouseMovements(filter, options);
  res.send(result);
});

module.exports = {
  createStockIn,
  createStockOut,
  getWarehouseMovements
};
