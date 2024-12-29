const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const shopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shop_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// add plugin that converts mongoose to json
shopSchema.plugin(toJSON);
shopSchema.plugin(paginate);

/**
 * @typedef Shop
 */
const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
