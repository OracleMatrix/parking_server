const Joi = require("joi");
const db = require("../models");
const ParkingsModel = db.parkings;
const UsersModel = db.users;

class ParkingsController {
    async createParking(req, res) {
        const schema = Joi.object({
            ownerId: Joi.number().integer().required(),
            name: Joi.string().required(),
            address: Joi.string().required(),
            isOpen: Joi.boolean().required(),
            totalCapacity: Joi.number().integer().min(1).required(),
            hourlyRate: Joi.number().precision(2).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        });
        const {error} = schema.validate(req.body);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const userExists = await UsersModel.findByPk(req.body.ownerId);
            if (!userExists) return res.status(404).send({message: "User not found"});

            if (userExists.role !== 'owner') return res.status(403).send({message: "User does not have permission to create parking"});

            const parking = await ParkingsModel.create(req.body);
            return res.status(201).send({parking});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async updateParking(req, res) {
        const schema = Joi.object({
            parkingId: Joi.number().integer().required(),
            ownerId: Joi.number().integer().required(),
            name: Joi.string().optional(),
            address: Joi.string().optional(),
            isOpen: Joi.boolean().optional(),
            totalCapacity: Joi.number().integer().min(1).optional(),
            hourlyRate: Joi.number().precision(2).optional(),
            latitude: Joi.number().optional(),
            longitude: Joi.number().optional(),
        });
        const {error} = schema.validate({...req.params, ...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const parking = await ParkingsModel.findByPk(req.params.parkingId);
            if (!parking)
                return res.status(404).send({message: "Parking not found"});
            const user = await UsersModel.findByPk(req.params.ownerId);
            if (!user)
                return res.status(404).send({message: "User not found"});

            if (user.role !== 'owner') return res.status(403).send({message: "User does not have permission to update parking"});

            const {
                name,
                address,
                isOpen,
                totalCapacity,
                hourlyRate,
                latitude,
                longitude,
            } = req.body;
            if (name !== undefined) parking.name = name;
            if (address !== undefined) parking.address = address;
            if (isOpen !== undefined) parking.isOpen = isOpen;
            if (totalCapacity !== undefined) parking.totalCapacity = totalCapacity;
            if (hourlyRate !== undefined) parking.hourlyRate = hourlyRate;
            if (latitude !== undefined) parking.latitude = latitude;
            if (longitude !== undefined) parking.longitude = longitude;

            await parking.save();

            return res.status(200).send({parking});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async deleteParking(req, res) {
        const schema = Joi.object({
            parkingId: Joi.number().integer().required(),
            ownerId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const parking = await ParkingsModel.findByPk(req.params.parkingId);
            if (!parking)
                return res.status(404).send({message: "Parking not found"});
            const user = await UsersModel.findByPk(req.params.ownerId);
            if (!user)
                return res.status(404).send({message: "User not found"});

            if (user.role !== 'owner') return res.status(403).send({message: "User does not have permission to delete parking"});

            await parking.destroy();

            return res.status(200).send({message: "Parking deleted successfully"});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async getParkingById(req, res) {
        const schema = Joi.object({
            parkingId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const parking = await ParkingsModel.findByPk(req.params.parkingId);
            if (!parking)
                return res.status(404).send({message: "Parking not found"});

            return res.status(200).send({parking});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }
}

module.exports = new ParkingsController();
