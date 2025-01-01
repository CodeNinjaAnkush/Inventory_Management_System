const Joi = require("joi");
const { objectId } = require("./custom.validation");

const getStockDetail = {
  query: Joi.object().keys({
    item: Joi.string().required().custom(objectId),
    shop: Joi.string(),
  }),
};

module.exports = {
  getStockDetail,
};
