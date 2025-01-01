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
  userService,
} = require("../services");

const getShopStockMovements = catchAsync(async (req, res) => {
  const user = await userService.getUserByIdWithShops(req.user.id);
  const shops = user.shops.map((shop) => shop._id);
  req.query.shops = shops;
  const filter = pick(req.query, ["status", "stock_type", "shop"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await shopStockMovementService.queryShopStockMovements(
    filter,
    options
  );
  res.send(result);
});

const acceptStockIn = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { shopStockMovementId, remark } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shopStockMovement = await shopStockMovementService.getById(
      shopStockMovementId
    );

    if (!shopStockMovement || shopStockMovement.status !== "Pending") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid or already processed stock-in request."
      );
    }

    const { item, shop, quantity, unit_price } = shopStockMovement;

    await warehouseMovementService.updateWarehouseMovement(
      shopStockMovement.warehouse_movement,
      {
        status: "Approved",
      },
      session
    );

    await shopStockMovementService.updateShopStockMovement(
      shopStockMovementId,
      {
        user: userId,
        status: "Approved",
        remark,
      },
      session
    );

    const whStockBalance = await allStockBalanceService.getStockByItem(item);
    await allStockBalanceService.updateStockBalance(
      whStockBalance.id,
      {
        pending_stockout_qty: whStockBalance.pending_stockout_qty - quantity,
        stockout_qty: whStockBalance.stockout_qty + quantity,
        stock_balance: whStockBalance.stock_balance - quantity,
      },
      session
    );

    const shopStockBalance = await allStockBalanceService.getStockByItem(
      item,
      shop
    );

    await allStockBalanceService.updateStockBalance(
      shopStockBalance.id,
      {
        pending_stockin_qty: shopStockBalance.pending_stockin_qty - quantity,
        stockin_qty: shopStockBalance.stockin_qty + quantity,
        available_balance: shopStockBalance.available_balance + quantity,
        stock_balance: shopStockBalance.stock_balance + quantity,
        unitprice: unit_price,
        pending_unitprice: 0,
      },
      session
    );

    const stockDailyMovement =
      await stockDailyMovementService.addStockDailyMovement(
        {
          item: item,
          shop: null,
          stockout_qty: quantity,
          stock_balance: whStockBalance.stock_balance - quantity,
          unitprice: unit_price,
        },
        session
      );

    const shopStockDailyMovement =
      await stockDailyMovementService.addStockDailyMovement(
        {
          item: item,
          shop: shop,
          stockin_qty: quantity,
          stock_balance: shopStockBalance.stock_balance + quantity,
          unitprice: unit_price,
        },
        session
      );

    await stockUpdateLogService.addStockUpdateLog(
      {
        item: item,
        shop: null,
        old_stockin_qty: whStockBalance.stockin_qty,
        old_stockout_qty: whStockBalance.stockout_qty,
        old_unitprice: whStockBalance.unitprice,
        stockout_qty: quantity,
        old_stockbalance: whStockBalance.stock_balance,
        stock_balance: whStockBalance.stock_balance - quantity,
        unitprice: unit_price,
        created_by: req.user.id,
      },
      session
    );

    await stockUpdateLogService.addStockUpdateLog(
      {
        item: item,
        shop: shop,
        old_stockin_qty: shopStockBalance.stockin_qty,
        old_stockout_qty: shopStockBalance.stockout_qty,
        old_stockbalance: shopStockBalance.stock_balance,
        old_unitprice: shopStockBalance.unitprice,
        stockin_qty: quantity,
        stock_balance: shopStockBalance.stock_balance + quantity,
        unitprice: unit_price,
        created_by: req.user.id,
      },
      session
    );

    await session.commitTransaction();

    res
      .status(httpStatus.OK)
      .send({ message: "Stock-in accepted and processed successfully." });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const createStockOut = catchAsync(async (req, res) => {
  const { shopId, itemId, quantity, remark } = req.body;

  const stockBalance = await allStockBalanceService.getStockByItem(
    itemId,
    shopId
  );
  if (!stockBalance || stockBalance.available_balance < quantity) {
    res.status(httpStatus.BAD_REQUEST).send({
      message: `Insufficient stock. Available balance in shop is ${
        stockBalance?.available_balance || 0
      }.`,
    });
  } else {
    const userId = req.user.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const shopStockMovement =
        await shopStockMovementService.createShopStockMovement(
          {
            warehouse_movement: null,
            stock_type: "Out",
            user: userId,
            shop: shopId,
            item: itemId,
            entry_datetime: Date(),
            stock_balance: stockBalance.available_balance,
            quantity,
            unit_price: stockBalance.unitprice,
            total_price: quantity * stockBalance.unitprice,
            remark,
            status: "Approved",
          },
          session
        );

      await allStockBalanceService.updateStockBalance(
        stockBalance.id,
        {
          stockout_qty: stockBalance.stockout_qty + quantity,
          available_balance: stockBalance.available_balance - quantity,
          stock_balance: stockBalance.stock_balance - quantity,
        },
        session
      );

      const stockDailyMovement =
        await stockDailyMovementService.addStockDailyMovement(
          {
            item: itemId,
            shop: shopId,
            stockout_qty: quantity,
            stock_balance: stockBalance.stock_balance - quantity,
            unitprice: stockBalance.unitprice,
          },
          session
        );

      await stockUpdateLogService.addStockUpdateLog(
        {
          item: itemId,
          shop: shopId,
          old_stockin_qty: stockBalance.stockin_qty,
          old_stockout_qty: stockBalance.stockout_qty,
          old_unitprice: stockBalance.unitprice,
          stockout_qty: quantity,
          old_stockbalance: stockBalance.stock_balance,
          stock_balance: stockBalance.stock_balance - quantity,
          unitprice: stockBalance.unitprice,
          created_by: req.user.id,
        },
        session
      );

      await session.commitTransaction();
      session.endSession();

      res.status(httpStatus.CREATED).send({
        message: "Stock-out successfully recorded.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
});

const rejectStockIn = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { shopStockMovementId, rejected_reason } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shopStockMovement = await shopStockMovementService.getById(
      shopStockMovementId
    );

    if (!shopStockMovement || shopStockMovement.status !== "Pending") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid or already processed stock-in request."
      );
    }

    const { item, shop, quantity, unit_price } = shopStockMovement;

    await warehouseMovementService.updateWarehouseMovement(
      shopStockMovement.warehouse_movement,
      {
        status: "Rejected",
        rejected_reason,
      },
      session
    );

    await shopStockMovementService.updateShopStockMovement(
      shopStockMovementId,
      {
        user: userId,
        status: "Rejected",
        rejected_reason,
      },
      session
    );

    const whStockBalance = await allStockBalanceService.getStockByItem(item);
    await allStockBalanceService.updateStockBalance(
      whStockBalance.id,
      {
        pending_stockout_qty: whStockBalance.pending_stockout_qty - quantity,
        available_balance: whStockBalance.available_balance + quantity,
      },
      session
    );

    const shopStockBalance = await allStockBalanceService.getStockByItem(
      item,
      shop
    );

    await allStockBalanceService.updateStockBalance(
      shopStockBalance.id,
      {
        pending_stockin_qty: shopStockBalance.pending_stockin_qty - quantity,
        pending_unitprice: 0,
      },
      session
    );

    await session.commitTransaction();

    res
      .status(httpStatus.OK)
      .send({ message: "Stock-in rejected successfully." });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

module.exports = {
  getShopStockMovements,
  acceptStockIn,
  createStockOut,
  rejectStockIn,
};
