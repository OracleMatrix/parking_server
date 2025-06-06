const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservations.controller");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         vehicleId:
 *           type: integer
 *           example: 1
 *         slotId:
 *           type: integer
 *           example: 1
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T10:00:00Z
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *         status:
 *           type: string
 *           enum: [reserved, cancelled, completed, no-show]
 *           example: reserved
 *     ReservationCreate:
 *       type: object
 *       required:
 *         - userId
 *         - vehicleId
 *         - slotId
 *         - startTime
 *         - endTime
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         vehicleId:
 *           type: integer
 *           example: 1
 *         slotId:
 *           type: integer
 *           example: 1
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T10:00:00Z
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *     ReservationCancel:
 *       type: object
 *       required:
 *         - reservationId
 *       properties:
 *         reservationId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationCreate'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error or slot unavailable
 *       500:
 *         description: Internal Server Error
 */
router.post("/", reservationsController.createReservation);

/**
 * @swagger
 * /api/reservations/{reservationId}/cancel:
 *   post:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Reservation not found or already cancelled
 *       500:
 *         description: Internal Server Error
 */
router.post("/:reservationId/cancel", reservationsController.cancelReservation);

/**
 * @swagger
 * /api/reservations/user/{userId}:
 *   get:
 *     summary: Get reservations by user ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/user/:userId", reservationsController.getReservationsByUser);

module.exports = router;
