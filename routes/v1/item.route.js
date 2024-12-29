const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const itemValidation = require("../../validations/item.validation");
const itemController = require("../../controllers/item.controller");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageItems"),
    validate(itemValidation.createItem),
    itemController.createItem
  )
  .get(
    auth("getItems"),
    validate(itemValidation.getItems),
    itemController.getItems
  );

router
  .route("/:itemId")
  .get(
    auth("getItems"),
    validate(itemValidation.getItem),
    itemController.getItem
  )
  .patch(
    auth("manageItems"),
    validate(itemValidation.updateItem),
    itemController.updateItem
  )
  .delete(
    auth("manageItems"),
    validate(itemValidation.deleteItem),
    itemController.deleteItem
  );

module.exports = router;
