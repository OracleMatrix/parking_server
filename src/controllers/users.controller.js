const Joi = require("joi");
const db = require("../models");
const UsersModel = db.users;

class UsersController {
    async getUserById(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const userExist = await UsersModel.findByPk(req.params.userId, {
                attributes: {exclude: ["password"]},
            });
            if (!userExist)
                return res.status(404).send({message: "User not found"});

            return res.status(200).send({user: userExist});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async updateUserProfile(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            fullName: Joi.string().optional(),
            email: Joi.string().email().optional(),
            phoneNumber: Joi.string().length(11).optional(),
            role: Joi.string()
                .valid("admin", "customer", "staff", "owner", "guard")
                .optional(),
        });
        const {error} = schema.validate({...req.params, ...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const user = await UsersModel.findByPk(req.params.userId);
            if (!user) return res.status(404).send({message: "User not found"});

            const {fullName, email, phoneNumber, role} = req.body;
            if (fullName !== undefined) user.fullName = fullName;
            if (email !== undefined) user.email = email;
            if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
            if (role !== undefined) user.role = role;

            await user.save();

            const updatedUser = await UsersModel.findByPk(req.params.userId, {
                attributes: {exclude: ["password"]},
            });

            return res.status(200).send({user: updatedUser});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async deleteUser(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
        });
        const {error} = schema.validate(req.params);
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const user = await UsersModel.findByPk(req.params.userId);
            if (!user) return res.status(404).send({message: "User not found"});

            await user.destroy();

            return res.status(200).send({message: "User deleted successfully"});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async changePassword(req, res) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            oldPassword: Joi.string().min(8).required(),
            newPassword: Joi.string().min(8).required(),
        });
        const {error} = schema.validate({...req.params, ...req.body});
        if (error)
            return res.status(400).send({message: error.details[0].message});

        try {
            const user = await UsersModel.findByPk(req.params.userId);
            if (!user) return res.status(404).send({message: "User not found"});

            const isMatch = await user.comparePassword(req.body.oldPassword);
            if (!isMatch)
                return res.status(400).send({message: "Old password is incorrect"});

            user.password = req.body.newPassword;
            await user.save();

            return res.status(200).send({message: "Password changed successfully"});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UsersModel.findAll({
                attributes: {exclude: ["password"]},
            });
            return res.status(200).send({users});
        } catch (error) {
            return res
                .status(500)
                .send({message: "Internal Server Error", error: error.message});
        }
    }
}

module.exports = new UsersController();
