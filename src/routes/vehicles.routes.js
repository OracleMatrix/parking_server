const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehicles.controller");

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [car, motorcycle, truck]
 *           example: car
 *         model:
 *           type: string
 *           example: Toyota Camry
 *         plateNumber:
 *           type: string
 *           example: ABC1234
 *         color:
 *           type: string
 *           example: Blue
 *     VehicleCreate:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *         - model
 *         - plateNumber
 *         - color
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [car, motorcycle, truck]
 *           example: car
 *         model:
 *           type: string
 *           example: Toyota Camry
 *         plateNumber:
 *           type: string
 *           example: ABC1234
 *         color:
 *           type: string
 *           example: Blue
 *     VehicleUpdate:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [car, motorcycle, truck]
 *           example: car
 *         model:
 *           type: string
 *           example: Toyota Camry
 *         plateNumber:
 *           type: string
 *           example: ABC1234
 *         color:
 *           type: string
 *           example: Blue
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleCreate'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", vehiclesController.addVehicle);

/**
 * @swagger
 * /api/vehicles/{vehicleId}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleUpdate'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:vehicleId", vehiclesController.updateVehicle);

/**
 * @swagger
 * /api/vehicles/{vehicleId}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:vehicleId", vehiclesController.deleteVehicle);

/**
 * @swagger
 * /api/vehicles/user/{userId}:
 *   get:
 *     summary: Get vehicles by user ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/user/:userId", vehiclesController.getUserVehicles);

module.exports = router;
