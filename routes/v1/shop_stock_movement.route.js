const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const shopStockMovementValidation = require("../../validations/shop_stock_movement.validation");
const shopStockMovementController = require("../../controllers/shop_stock_movement.controller");

const router = express.Router();

router
  .route("/")
  .get(
    auth("manageShopStock"),
    shopStockMovementController.getShopStockMovements
  );

router
  .route("/accept")
  .post(
    auth("manageShopStock"),
    validate(shopStockMovementValidation.acceptStockIn),
    shopStockMovementController.acceptStockIn
  );

module.exports = router;
