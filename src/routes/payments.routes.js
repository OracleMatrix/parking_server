const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments.controller");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         amount:
 *           type: number
 *           format: float
 *           example: 100.0
 *         type:
 *           type: string
 *           enum: [hourly, subscription, fine]
 *           example: hourly
 *         method:
 *           type: string
 *           enum: [card, cash, online, wallet]
 *           example: card
 *     PaymentCreate:
 *       type: object
 *       required:
 *         - userId
 *         - amount
 *         - type
 *         - method
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         amount:
 *           type: number
 *           format: float
 *           example: 100.0
 *         type:
 *           type: string
 *           enum: [hourly, subscription, fine]
 *           example: hourly
 *         method:
 *           type: string
 *           enum: [card, cash, online, wallet]
 *           example: card
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentCreate'
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", paymentsController.processPayment);

/**
 * @swagger
 * /api/payments/user/{userId}:
 *   get:
 *     summary: Get payments by user ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/user/:userId", paymentsController.getPaymentsByUser);

module.exports = router;
