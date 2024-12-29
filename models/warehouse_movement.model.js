const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const warehouseMovementSchema = mongoose.Schema(
  {
    stock_type: {
      type: String,
      enum: ["In", "Out"],
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shop",
      default: null,
    },
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Item",
      required: true,
    },
    stock_balance: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      default: null,
    },
    unit_price: {
      type: Number,
      default: null,
    },
    total_price: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Delivered", "Received"],
      default: "Pending",
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
warehouseMovementSchema.plugin(toJSON);
warehouseMovementSchema.plugin(paginate);

/**
 * @typedef WarehouseMovement
 */
const WarehouseMovement = mongoose.model(
  "WarehouseMovement",
  warehouseMovementSchema
);

module.exports = WarehouseMovement;
