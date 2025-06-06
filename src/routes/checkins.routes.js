const express = require("express");
const router = express.Router();
const checkinsController = require("../controllers/checkins.controller");

/**
 * @swagger
 * tags:
 *   name: Checkins
 *   description: Check-in and check-out management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Checkin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         vehicleId:
 *           type: integer
 *           example: 1
 *         slotId:
 *           type: integer
 *           example: 1
 *         entryTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T10:00:00Z
 *         exitTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *         overStayFine:
 *           type: number
 *           format: float
 *           example: 20.0
 *     CheckinCreate:
 *       type: object
 *       required:
 *         - vehicleId
 *         - slotId
 *       properties:
 *         vehicleId:
 *           type: integer
 *           example: 1
 *         slotId:
 *           type: integer
 *           example: 1
 *         entryTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T10:00:00Z
 *     CheckinUpdate:
 *       type: object
 *       properties:
 *         exitTime:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 */

/**
 * @swagger
 * /api/checkins:
 *   post:
 *     summary: Record a check-in
 *     tags: [Checkins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckinCreate'
 *     responses:
 *       201:
 *         description: Check-in recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Checkin'
 *       400:
 *         description: Validation error or already checked in
 *       500:
 *         description: Internal Server Error
 */
router.post("/", checkinsController.checkIn);

/**
 * @swagger
 * /api/checkins/{checkinId}/checkout:
 *   post:
 *     summary: Record a check-out
 *     tags: [Checkins]
 *     parameters:
 *       - in: path
 *         name: checkinId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Check-in ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckinUpdate'
 *     responses:
 *       200:
 *         description: Check-out recorded successfully
 *       400:
 *         description: Validation error or invalid check-in
 *       500:
 *         description: Internal Server Error
 */
router.post("/:checkinId/checkout", checkinsController.checkOut);

/**
 * @swagger
 * /api/checkins/vehicle/{vehicleId}:
 *   get:
 *     summary: Get check-ins by vehicle ID
 *     tags: [Checkins]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: List of check-ins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkins:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Checkin'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/vehicle/:vehicleId", checkinsController.getCheckinsByVehicle);

module.exports = router;
