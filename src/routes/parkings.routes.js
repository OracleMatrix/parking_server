const express = require("express");
const router = express.Router();
const parkingsController = require("../controllers/parkings.controller");

/**
 * @swagger
 * tags:
 *   name: Parkings
 *   description: Parking management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Parking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ownerId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Downtown Parking
 *         address:
 *           type: string
 *           example: 123 Main St
 *         isOpen:
 *           type: boolean
 *           example: true
 *         totalCapacity:
 *           type: integer
 *           example: 100
 *         hourlyRate:
 *           type: number
 *           format: float
 *           example: 5.5
 *         latitude:
 *           type: number
 *           format: float
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           format: float
 *           example: -74.0060
 *     ParkingCreate:
 *       type: object
 *       required:
 *         - ownerId
 *         - name
 *         - address
 *         - isOpen
 *         - totalCapacity
 *         - hourlyRate
 *         - latitude
 *         - longitude
 *       properties:
 *         ownerId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Downtown Parking
 *         address:
 *           type: string
 *           example: 123 Main St
 *         isOpen:
 *           type: boolean
 *           example: true
 *         totalCapacity:
 *           type: integer
 *           example: 100
 *         hourlyRate:
 *           type: number
 *           format: float
 *           example: 5.5
 *         latitude:
 *           type: number
 *           format: float
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           format: float
 *           example: -74.0060
 *     ParkingUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Downtown Parking
 *         address:
 *           type: string
 *           example: 123 Main St
 *         isOpen:
 *           type: boolean
 *           example: true
 *         totalCapacity:
 *           type: integer
 *           example: 100
 *         hourlyRate:
 *           type: number
 *           format: float
 *           example: 5.5
 *         latitude:
 *           type: number
 *           format: float
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           format: float
 *           example: -74.0060
 */

/**
 * @swagger
 * /api/parkings:
 *   post:
 *     summary: Create a new parking
 *     tags: [Parkings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParkingCreate'
 *     responses:
 *       201:
 *         description: Parking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parking'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", parkingsController.createParking);

/**
 * @swagger
 * /api/parkings/{parkingId}:
 *   put:
 *     summary: Update a parking
 *     tags: [Parkings]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Parking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParkingUpdate'
 *     responses:
 *       200:
 *         description: Parking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parking'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parking not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:parkingId", parkingsController.updateParking);

/**
 * @swagger
 * /api/parkings/{parkingId}:
 *   delete:
 *     summary: Delete a parking
 *     tags: [Parkings]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Parking ID
 *     responses:
 *       200:
 *         description: Parking deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parking not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:parkingId", parkingsController.deleteParking);

/**
 * @swagger
 * /api/parkings/{parkingId}:
 *   get:
 *     summary: Get parking by ID
 *     tags: [Parkings]
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Parking ID
 *     responses:
 *       200:
 *         description: Parking found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parking'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Parking not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:parkingId", parkingsController.getParkingById);

module.exports = router;
