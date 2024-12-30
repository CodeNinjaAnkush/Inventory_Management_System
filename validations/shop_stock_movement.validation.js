const Joi = require("joi");
const { objectId } = require("./custom.validation");

const acceptStockIn = {
  body: Joi.object().keys({
    shopStockMovementId: Joi.string().required().custom(objectId),
    remark: Joi.string(),
  }),
};

module.exports = {
  acceptStockIn,
};
