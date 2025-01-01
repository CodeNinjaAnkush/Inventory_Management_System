const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const allStockBalanceValidation = require("../../validations/all_stock_balance.validation");
const allStockBalanceController = require("../../controllers/all_stock_balance.controller");

const router = express.Router();

router
  .route("/")
  .get(
    auth("getAllStockBalance"),
    validate(allStockBalanceValidation.getStockDetail),
    allStockBalanceController.getDetail
  );

module.exports = router;
