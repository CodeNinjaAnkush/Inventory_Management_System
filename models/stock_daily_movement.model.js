const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const stockDailyMovementSchema = mongoose.Schema(
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// add plugin that converts mongoose to json
stockDailyMovementSchema.plugin(toJSON);
stockDailyMovementSchema.plugin(paginate);

/**
 * @typedef StockDailyMovement
 */
const StockDailyMovement = mongoose.model('StockDailyMovement', stockDailyMovementSchema);

module.exports = StockDailyMovement;
