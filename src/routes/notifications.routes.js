const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications.controller");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Reservation Confirmed
 *         body:
 *           type: string
 *           example: Your reservation has been confirmed.
 *         read:
 *           type: boolean
 *           example: false
 *     NotificationCreate:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - body
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Reservation Confirmed
 *         body:
 *           type: string
 *           example: Your reservation has been confirmed.
 *         read:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Send a notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationCreate'
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", notificationsController.sendNotification);

/**
 * @swagger
 * /api/notifications/user/{userId}:
 *   get:
 *     summary: Get notifications by user ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/user/:userId", notificationsController.getNotificationsByUser);

module.exports = router;
