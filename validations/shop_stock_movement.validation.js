const Joi = require("joi");
const { objectId } = require("./custom.validation");

const acceptStockIn = {
  body: Joi.object().keys({
    shopStockMovementId: Joi.string().required().custom(objectId),
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

const rejectStockIn = {
  body: Joi.object().keys({
    shopStockMovementId: Joi.string().required().custom(objectId),
    rejected_reason: Joi.string().required(),
  }),
};

module.exports = {
  acceptStockIn,
  createStockOut,
  rejectStockIn,
};
