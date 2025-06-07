const Joi = require("joi");
const db = require("../models");
const ReservationsModel = db.reservations;
const UsersModel = db.users;
const VehiclesModel = db.vehicles;
const ParkingsSlotsModel = db.parkingsSlot;
const {Op} = require("sequelize");

class ReservationsController {
    async createReservation(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            vehicleId: Joi.number().integer().required(),
            slotId: Joi.number().integer().required(),
            startTime: Joi.date().iso().required(),
            endTime: Joi.date().iso().required(),
        });
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send({message: error.details[0].message});

        if (new Date(req.body.startTime) >= new Date(req.body.endTime)) {
            return res
                .status(400)
                .send({message: "End time must be after start time"});
        }

        try {
            // Check if slot is available for the requested time
            const user = await UsersModel.findByPk(req.body.userId);
            if (!user) return res.status(404).send({message: "user not found"});

            const vehicle = await VehiclesModel.findByPk(req.body.vehicleId);
            if (!vehicle) return res.status(404).send({message: "Vehicle not found"});

            const slot = await ParkingsSlotsModel.findByPk(req.body.slotId);
            if (!slot) return res.status(404).send({message: "Slot not found"});

            const overlappingReservation = await ReservationsModel.findOne({
                where: {
                    slotId: req.body.slotId, [Op.or]: [{
                        startTime: {
                            [Op.between]: [req.body.startTime, req.body.endTime],
                        },
                    }, {
                        endTime: {
                            [Op.between]: [req.body.startTime, req.body.endTime],
                        },
                    }, {
                        startTime: {
                            [Op.lte]: req.body.startTime,
                        }, endTime: {
                            [Op.gte]: req.body.endTime,
                        },
                    },], status: "reserved",
                },
            });

            if (overlappingReservation) {
                return res
                    .status(400)
                    .send({message: "Slot is not available for the selected time"});
            }

            const isSlotAvailable = await ParkingsSlotsModel.findOne({
                where: {
                    id: req.body.slotId, isAvailable: true,
                }
            });

            if (!isSlotAvailable) return res.status(403).send({message: "Slot not available, please select another slot"});

            const reservation = await ReservationsModel.create({
                userId: req.body.userId,
                vehicleId: req.body.vehicleId,
                slotId: req.body.slotId,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                status: "reserved",
            });

            await ParkingsSlotsModel.update({isAvailable: false}, {
                where: {
                    id: req.body.slotId,
                },
            });

            return res.status(201).send({reservation});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async cancelReservation(req, res) {
        const schema = Joi.object({
            reservationId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error) return res.status(400).send({message: error.details[0].message});

        try {
            const reservation = await ReservationsModel.findByPk(req.params.reservationId);
            if (!reservation || reservation.status !== "reserved") {
                return res
                    .status(404)
                    .send({message: "Reservation not found or already cancelled"});
            }
            reservation.status = "cancelled";
            await reservation.save();
            await ParkingsSlotsModel.update({isAvailable: true,}, {
                where: {
                    id: reservation.slotId,
                }
            })
            return res
                .status(200)
                .send({message: "Reservation cancelled successfully"});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async getReservationsByUser(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error) return res.status(400).send({message: error.details[0].message});

        try {
            const user = await UsersModel.findByPk(req.params.userId);
            if (!user) return res.status(404).send({message: "user not found"});

            const reservations = await ReservationsModel.findAll({
                where: {userId: req.params.userId},
            });
            return res.status(200).send({reservations});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }
}

module.exports = new ReservationsController();
