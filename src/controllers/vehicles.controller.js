const Joi = require("joi");
const db = require("../models");
const VehiclesModel = db.vehicles;
const UsersModel = db.users;

class VehiclesController {
    async addVehicle(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            type: Joi.string().valid("car", "motorcycle", "truck").required(),
            model: Joi.string().required(),
            plateNumber: Joi.string().required(),
            color: Joi.string().required(),
        });
        const {error} = schema.validate({...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const user = await UsersModel.findByPk(req.body.userId);
            if (!user) return res.status(404).send({message: "user not found"});

            if (user.role !== 'customer' && user.role !== 'admin' && user.role !== 'staff') {
                return res.status(403).send({message: "User does not have permission to add vehicle"});
            }

            const vehicle = await VehiclesModel.create(req.body);
            return res.status(201).send({vehicle});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async updateVehicle(req, res) {
        const schema = Joi.object({
            vehicleId: Joi.number().integer().required(),
            type: Joi.string().valid("car", "motorcycle", "truck").optional(),
            model: Joi.string().optional(),
            plateNumber: Joi.string().optional(),
            color: Joi.string().optional(),
        });
        const {error} = schema.validate({...req.params, ...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const vehicle = await VehiclesModel.findByPk(req.params.vehicleId);
            if (!vehicle)
                return res.status(404).send({message: "Vehicle not found"});

            const {type, model, plateNumber, color} = req.body;
            if (type !== undefined) vehicle.type = type;
            if (model !== undefined) vehicle.model = model;
            if (plateNumber !== undefined) vehicle.plateNumber = plateNumber;
            if (color !== undefined) vehicle.color = color;

            await vehicle.save();

            return res.status(200).send({vehicle});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async deleteVehicle(req, res) {
        const schema = Joi.object({
            vehicleId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const vehicle = await VehiclesModel.findByPk(req.params.vehicleId);
            if (!vehicle)
                return res.status(404).send({message: "Vehicle not found"});

            await vehicle.destroy();

            return res.status(200).send({message: "Vehicle deleted successfully"});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async getUserVehicles(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const vehicles = await VehiclesModel.findAll({
                where: {userId: req.params.userId},
            });
            return res.status(200).send({vehicles});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }
}

module.exports = new VehiclesController();
