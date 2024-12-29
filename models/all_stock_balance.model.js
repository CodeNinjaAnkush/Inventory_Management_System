const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const allStockBalanceSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Item",
      default: null,
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shop",
      default: null,
    },
    stockin_qty: {
      type: Number,
      default: 0,
    },
    stockout_qty: {
      type: Number,
      default: 0,
    },
    pending_stockin_qty: {
      type: Number,
      default: 0,
    },
    pending_stockout_qty: {
      type: Number,
      default: 0,
    },
    available_balance: {
      type: Number,
      default: 0,
    },
    stock_balance: {
      type: Number,
      default: 0,
    },
    unitprice: {
      type: Number,
      default: 0,
    },
    pending_unitprice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// add plugin that converts mongoose to json
allStockBalanceSchema.plugin(toJSON);
allStockBalanceSchema.plugin(paginate);

/**
 * @typedef AllStockBalance
 */
const AllStockBalance = mongoose.model(
  "AllStockBalance",
  allStockBalanceSchema
);

module.exports = AllStockBalance;
