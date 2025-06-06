const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logs.controller");

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: System logs management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         actorId:
 *           type: integer
 *           example: 1
 *         action:
 *           type: string
 *           example: User login
 *         ip:
 *           type: string
 *           example: 192.168.1.1
 *     LogCreate:
 *       type: object
 *       required:
 *         - actorId
 *         - action
 *         - ip
 *       properties:
 *         actorId:
 *           type: integer
 *           example: 1
 *         action:
 *           type: string
 *           example: User login
 *         ip:
 *           type: string
 *           example: 192.168.1.1
 */

/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Record a log entry
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogCreate'
 *     responses:
 *       201:
 *         description: Log recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", logsController.recordLog);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get logs with optional filters
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: actorId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Actor ID to filter logs
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         required: false
 *         description: Action string to filter logs
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.get("/", logsController.getLogs);

module.exports = router;
