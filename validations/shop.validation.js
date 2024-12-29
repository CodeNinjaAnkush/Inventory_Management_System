const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createShop = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    shop_code: Joi.string().required(),
    description: Joi.string().allow(null, ''),
  }),
};

const getShops = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getShop = {
  params: Joi.object().keys({
    shopId: Joi.string().custom(objectId),
  }),
};

const updateShop = {
  params: Joi.object().keys({
    shopId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      shop_code: Joi.string(),
      description: Joi.string().allow(null, ''),
    })
    .min(1),
};

const deleteShop = {
  params: Joi.object().keys({
    shopId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
};
