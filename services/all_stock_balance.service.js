const { AllStockBalance } = require("../models");

const updateOrCreateBalance = async (
  { item, shop, quantity, unitPrice },
  session
) => {
  const currentBalance = await AllStockBalance.findOne({ item, shop }).session(
    session
  );

  if (currentBalance) {
    const updatedBalance = await AllStockBalance.findByIdAndUpdate(
      currentBalance._id,
      {
        $inc: {
          stockin_qty: quantity,
          available_balance: quantity,
          stock_balance: quantity,
        },
        $set: { unitprice: unitPrice },
      },
      { new: true, session }
    );
    return {
      ...updatedBalance.toObject(),
      previous_balance: currentBalance.stock_balance,
      previous_stockin: currentBalance.stockin_qty,
      previous_unitprice: currentBalance.unitprice,
    };
  }

  const newBalance = await AllStockBalance.create(
    [
      {
        item,
        shop,
        stockin_qty: quantity,
        available_balance: quantity,
        stock_balance: quantity,
        unitprice: unitPrice,
      },
    ],
    { session }
  );

  return {
    ...newBalance[0].toObject(),
    previous_balance: 0,
    previous_stockin: 0,
    previous_unitprice: 0,
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getStockByItem = async (item, shop) => {
  const currentBalance = await AllStockBalance.findOne({ item, shop });
  return currentBalance;
};

const updateStockBalance = async (id, updateData, session) => {
  return AllStockBalance.findByIdAndUpdate(id, updateData, {
    new: true,
    session,
  });
};

const updateOrCreateBalanceForShop = async (
  { item, shop, quantity, unitPrice },
  session
) => {
  const currentBalance = await AllStockBalance.findOne({ item, shop }).session(
    session
  );

  if (currentBalance) {
    const updatedBalance = await AllStockBalance.findByIdAndUpdate(
      currentBalance.id,
      {
        $inc: {
          pending_stockin_qty: quantity,
        },
        $set: { pending_unitprice: unitPrice },
      },
      { new: true, session }
    );
    return updatedBalance;
  }

  const newBalance = await AllStockBalance.create(
    [
      {
        item,
        shop,
        pending_stockin_qty: quantity,
        pending_unitprice: unitPrice,
      },
    ],
    { session }
  );

  return newBalance[0].toObject();
};

module.exports = {
  updateOrCreateBalance,
  getStockByItem,
  updateStockBalance,
  updateOrCreateBalanceForShop,
};
