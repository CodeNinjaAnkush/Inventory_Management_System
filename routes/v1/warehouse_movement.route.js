const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const warehouseMovementValidation = require("../../validations/warehouse_movement.validation");
const warehouseMovementController = require("../../controllers/warehouse_movement.controller");

const router = express.Router();

router
  .route("/in")
  .post(
    auth("manageWarehouseStock"),
    validate(warehouseMovementValidation.createStockIn),
    warehouseMovementController.createStockIn
  );

router
  .route("/out")
  .post(
    auth("manageWarehouseStock"),
    validate(warehouseMovementValidation.createStockOut),
    warehouseMovementController.createStockOut
  );

router
  .route("/")
  .get(
    auth("manageWarehouseStock"),
    warehouseMovementController.getWarehouseMovements
  );

module.exports = router;
