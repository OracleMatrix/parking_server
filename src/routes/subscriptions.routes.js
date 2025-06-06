const express = require("express");
const router = express.Router();
const subscriptionsController = require("../controllers/subscriptions.controller");

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         parkingId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Monthly Pass
 *         durationDays:
 *           type: integer
 *           example: 30
 *         price:
 *           type: number
 *           format: float
 *           example: 99.99
 *         vehicleType:
 *           type: string
 *           enum: [car, motorcycle, truck]
 *           example: car
 *     SubscriptionCreate:
 *       type: object
 *       required:
 *         - parkingId
 *         - name
 *         - durationDays
 *         - price
 *         - vehicleType
 *       properties:
 *         parkingId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Monthly Pass
 *         durationDays:
 *           type: integer
 *           example: 30
 *         price:
 *           type: number
 *           format: float
 *           example: 99.99
 *         vehicleType:
 *           type: string
 *           enum: [car, motorcycle, truck]
 *           example: car
 *     SubscriptionUpdate:
 *       type: object
 *       properties:
 *         parkingId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Monthly Pass
 *         durationDays:
 *           type: integer
 *           example: 30
 *         price:
 *           type: number
 *           format: float
 *           example: 99.99
 *         vehicleType:
 *           type: string
 *           enum: [car, motorcycle, truck]
 *           example: car
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionCreate'
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parking not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/", subscriptionsController.createSubscription);

/**
 * @swagger
 * /api/subscriptions/{subscriptionId}:
 *   put:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionUpdate'
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subscription or Parking not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:subscriptionId", subscriptionsController.updateSubscription);

/**
 * @swagger
 * /api/subscriptions/{subscriptionId}:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:subscriptionId", subscriptionsController.deleteSubscription);

/**
 * @swagger
 * /api/subscriptions/{subscriptionId}:
 *   get:
 *     summary: Get subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:subscriptionId", subscriptionsController.getSubscriptionById);

module.exports = router;
