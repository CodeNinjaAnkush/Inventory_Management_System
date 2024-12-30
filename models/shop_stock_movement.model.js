const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const shopStockMovementSchema = mongoose.Schema(
  {
    warehouse_movement: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'WarehouseMovement',
      default: null,
    },
    stock_type: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null,
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Shop',
      default: null,
    },
    entry_datetime: {
      type: Date,
      required: true,
    },
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Item',
      required: true,
    },
    stock_balance: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    unit_price: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Delivered', 'Received'],
      default: 'Pending',
    },
    rejected_reason: {
      type: String,
      default: null,
    },
    remark: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// add plugin that converts mongoose to json
shopStockMovementSchema.plugin(toJSON);
shopStockMovementSchema.plugin(paginate);

/**
 * @typedef ShopStockMovement
 */
const ShopStockMovement = mongoose.model('ShopStockMovement', shopStockMovementSchema);

module.exports = ShopStockMovement;
