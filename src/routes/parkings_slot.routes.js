const express = require("express");
const router = express.Router();
const parkingsSlotController = require("../controllers/parkings_slot.controller");

/**
 * @swagger
 * tags:
 *   name: ParkingSlots
 *   description: Parking slot management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ParkingSlot:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         parkingId:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: A1
 *         type:
 *           type: string
 *           enum: [normal, VIP, disabled]
 *           example: normal
 *         isAvailable:
 *           type: boolean
 *           example: true
 *     ParkingSlotCreate:
 *       type: object
 *       required:
 *         - parkingId
 *         - code
 *         - type
 *         - isAvailable
 *       properties:
 *         parkingId:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: A1
 *         type:
 *           type: string
 *           enum: [normal, VIP, disabled]
 *           example: normal
 *         isAvailable:
 *           type: boolean
 *           example: true
 *     ParkingSlotUpdate:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: A1
 *         type:
 *           type: string
 *           enum: [normal, VIP, disabled]
 *           example: normal
 *         isAvailable:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/parkings-slots:
 *   post:
 *     summary: Add a new parking slot
 *     tags: [ParkingSlots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParkingSlotCreate'
 *     responses:
 *       201:
 *         description: Parking slot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParkingSlot'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", parkingsSlotController.addSlot);

/**
 * @swagger
 * /api/parkings-slots/{slotId}:
 *   put:
 *     summary: Update a parking slot
 *     tags: [ParkingSlots]
 *     parameters:
 *       - in: path
 *         name: slotId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Parking slot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParkingSlotUpdate'
 *     responses:
 *       200:
 *         description: Parking slot updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParkingSlot'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parking slot not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:slotId", parkingsSlotController.updateSlot);

/**
 * @swagger
 * /api/parkings-slots/{slotId}:
 *   delete:
 *     summary: Delete a parking slot
 *     tags: [ParkingSlots]
 *     parameters:
 *       - in: path
 *         name: slotId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Parking slot ID
 *     responses:
 *       200:
 *         description: Parking slot deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parking slot not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:slotId", parkingsSlotController.deleteSlot);

/**
 * @swagger
 * /api/parkings-slots/parking/{parkingId}:
 *   get:
 *     summary: Get parking slots by parking ID
 *     tags: [ParkingSlots]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Parking ID
 *     responses:
 *       200:
 *         description: List of parking slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ParkingSlot'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/parking/:parkingId", parkingsSlotController.getSlotsByParking);

module.exports = router;
