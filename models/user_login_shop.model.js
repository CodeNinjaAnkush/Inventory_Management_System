const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const userLoginShopSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Shop',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// add plugin that converts mongoose to json
userLoginShopSchema.plugin(toJSON);

/**
 * @typedef UserLoginShop
 */
const UserLoginShop = mongoose.model('UserLoginShop', userLoginShopSchema);

module.exports = UserLoginShop;
