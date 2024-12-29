const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const shopValidation = require("../../validations/shop.validation");
const shopController = require("../../controllers/shop.controller");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageShops"),
    validate(shopValidation.createShop),
    shopController.createShop
  )
  .get(
    auth("getShops"),
    validate(shopValidation.getShops),
    shopController.getShops
  );

router
  .route("/:shopId")
  .get(
    auth("getShops"),
    validate(shopValidation.getShop),
    shopController.getShop
  )
  .patch(
    auth("manageShops"),
    validate(shopValidation.updateShop),
    shopController.updateShop
  )
  .delete(
    auth("manageShops"),
    validate(shopValidation.deleteShop),
    shopController.deleteShop
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Shop management and retrieval
 */

/**
 * @swagger
 * /shops:
 *   post:
 *     summary: Create a shop
 *     description: Only admins can create shops.
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - shop_code
 *             properties:
 *               name:
 *                 type: string
 *               shop_code:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *             example:
 *               name: Example Shop
 *               shop_code: EX123
 *               description: An example shop
 *               is_active: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Shop'
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all shops
 *     description: Anyone can retrieve all shops.
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Shop name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of shops
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shop'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /shops/{id}:
 *   get:
 *     summary: Get a shop
 *     description: Anyone can fetch shop details by ID.
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Shop'
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Not Found
 *
 *   patch:
 *     summary: Update a shop
 *     description: Only admins can update shop details.
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shop_code:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *             example:
 *               name: Updated Shop
 *               shop_code: UPD123
 *               description: Updated description
 *               is_active: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Shop'
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauth
 *
 */
