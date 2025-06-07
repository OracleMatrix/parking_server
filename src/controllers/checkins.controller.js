const Joi = require("joi");
const db = require("../models");
const CheckinsModel = db.checkins;
const ParkingsSlotModel = db.parkingsSlot;
const VehiclesModel = db.vehicles;

class CheckinsController {
    async checkIn(req, res) {
        const schema = Joi.object({
            vehicleId: Joi.number().integer().required(),
            slotId: Joi.number().integer().required(),
            entryTime: Joi.date().iso().optional(),
        });
        const {error} = schema.validate(req.body);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const vehicle = await VehiclesModel.findByPk(req.body.vehicleId);
            if (!vehicle) return res.status(404).send({message: "Vehicle not found"});

            const slot = await ParkingsSlotModel.findByPk(req.body.slotId);
            if (!slot) return res.status(404).send({message: "Slot not found"});

            const existingCheckin = await CheckinsModel.findOne({
                where: {
                    vehicleId: req.body.vehicleId,
                    slotId: req.body.slotId,
                    entryTime: req.body.entryTime,
                },
            });
            if (existingCheckin) {
                return res.status(400).send({message: "Already checked in"});
            }

            const checkin = await CheckinsModel.create({
                vehicleId: req.body.vehicleId,
                slotId: req.body.slotId,
                entryTime: req.body.entryTime || new Date(),
                exitTime: null,
                overStayFine: 0,
            });

            await ParkingsSlotModel.update({isAvailable: false,}, {
                where: {
                    id: req.body.slotId,
                }
            })

            return res.status(201).send({checkin});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async checkOut(req, res) {
        const schema = Joi.object({
            checkinId: Joi.number().integer().required(),
            exitTime: Joi.date().iso().optional(),
        });
        const {error} = schema.validate({...req.params, ...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const checkin = await CheckinsModel.findByPk(req.params.checkinId);
            if (!checkin || checkin.exitTime) {
                return res
                    .status(400)
                    .send({message: "Invalid check-in or already checked out"});
            }

            checkin.exitTime = req.body.exitTime || new Date();

            // Calculate overStayFine if exitTime is after entryTime + allowed duration (not specified here)
            // For demonstration, assume allowed duration is 1 hour, fine rate 10 per hour
            const allowedDurationMs = 60 * 60 * 1000;
            const overstayMs =
                checkin.exitTime - checkin.entryTime - allowedDurationMs;
            let overStayFine = 0;
            if (overstayMs > 0) {
                const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));
                const fineRatePerHour = 10;
                overStayFine = overstayHours * fineRatePerHour;
            }
            checkin.overStayFine = overStayFine;

            await checkin.save();
            await ParkingsSlotModel.update({isAvailable: true,}, {
                where: {
                    id: checkin.slotId,
                }
            })

            return res
                .status(200)
                .send({message: "Check-out recorded", overStayFine});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async getCheckinsByVehicle(req, res) {
        const schema = Joi.object({
            vehicleId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const vehicle = await VehiclesModel.findByPk(req.params.vehicleId);
            if (!vehicle) return res.status(404).send({message: "Vehicle not found"});

            const checkins = await CheckinsModel.findAll({
                where: {vehicleId: req.params.vehicleId},
            });
            return res.status(200).send({checkins});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }
}

module.exports = new CheckinsController();
