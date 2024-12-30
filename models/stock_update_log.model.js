const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const stockUpdateLogSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Item',
      required: true,
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Shop',
      default: null,
    },
    old_stockin_qty: {
      type: Number,
      default: 0,
    },
    old_stockout_qty: {
      type: Number,
      default: 0,
    },
    old_stockbalance: {
      type: Number,
      default: 0,
    },
    old_unitprice: {
      type: Number,
      default: 0,
    },
    stockin_qty: {
      type: Number,
      default: 0,
    },
    stockout_qty: {
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
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only log creation timestamps
  }
);

// add plugin that converts mongoose to json
stockUpdateLogSchema.plugin(toJSON);
stockUpdateLogSchema.plugin(paginate);

/**
 * @typedef StockUpdateLog
 */
const StockUpdateLog = mongoose.model('StockUpdateLog', stockUpdateLogSchema);

module.exports = StockUpdateLog;
