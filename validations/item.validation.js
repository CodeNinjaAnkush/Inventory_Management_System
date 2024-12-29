const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createItem = {
  body: Joi.object().keys({
    category: Joi.string().required().custom(objectId),
    name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    is_active: Joi.boolean(),
  }),
};

const getItems = {
  query: Joi.object().keys({
    category: Joi.string().custom(objectId),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      category: Joi.string().custom(objectId),
      name: Joi.string(),
      description: Joi.string().allow(null, ""),
      is_active: Joi.boolean(),
    })
    .min(1),
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
