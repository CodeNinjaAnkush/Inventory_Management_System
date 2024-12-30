const Joi = require("joi");
const { objectId } = require("./custom.validation");
const { AllStockBalance } = require("../models");

const createStockIn = {
  body: Joi.object().keys({
    itemId: Joi.string().required().custom(objectId),
    quantity: Joi.number().integer().positive().required(),
    unitPrice: Joi.number().integer().positive().required(),
    remark: Joi.string(),
  }),
};

const createStockOut = {
  body: Joi.object().keys({
    shopId: Joi.string().required().custom(objectId),
    itemId: Joi.string().required().custom(objectId),
    quantity: Joi.number().integer().positive().required(),
    remark: Joi.string(),
  }),
};

module.exports = {
  createStockIn,
  createStockOut,
};
