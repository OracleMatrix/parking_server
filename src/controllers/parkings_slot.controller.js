const Joi = require("joi");
const db = require("../models");
const ParkingsSlotModel = db.parkingsSlot;
const ParkingsModel = db.parkings;
const UsersModel = db.users;

class ParkingsSlotController {
    async addSlot(req, res) {
        const schema = Joi.object({
            parkingId: Joi.number().integer().required(),
            code: Joi.string().required(),
            type: Joi.string().valid("normal", "VIP", "disabled").required(),
            isAvailable: Joi.boolean().required(),
        });
        const {error} = schema.validate(req.body);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const parking = await ParkingsModel.findByPk(req.body.parkingId);
            if (!parking) return res.status(404).send({message: "Parking not found"});

            const slot = await ParkingsSlotModel.create(req.body);
            return res.status(201).send({slot});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async updateSlot(req, res) {
        const schema = Joi.object({
            slotId: Joi.number().integer().required(),
            code: Joi.string().optional(),
            type: Joi.string().valid("normal", "VIP", "disabled").optional(),
            isAvailable: Joi.boolean().optional(),
        });
        const {error} = schema.validate({...req.params, ...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const slot = await ParkingsSlotModel.findByPk(req.params.slotId);
            if (!slot) return res.status(404).send({message: "Slot not found"});

            const {code, type, isAvailable} = req.body;
            if (code !== undefined) slot.code = code;
            if (type !== undefined) slot.type = type;
            if (isAvailable !== undefined) slot.isAvailable = isAvailable;

            await slot.save();

            return res.status(200).send({slot});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async deleteSlot(req, res) {
        const schema = Joi.object({
            slotId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const slot = await ParkingsSlotModel.findByPk(req.params.slotId);
            if (!slot) return res.status(404).send({message: "Slot not found"});

            await slot.destroy();

            return res.status(200).send({message: "Slot deleted successfully"});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async getSlotsByParking(req, res) {
        const schema = Joi.object({
            parkingId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const parking = await ParkingsModel.findByPk(req.params.parkingId);
            if (!parking) return res.status(404).send({message: "Parking not found"});

            const slots = await ParkingsSlotModel.findAll({
                where: {parkingId: req.params.parkingId},
            });
            return res.status(200).send({slots});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }
}

module.exports = new ParkingsSlotController();
