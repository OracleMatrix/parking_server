const Joi = require("joi");
const db = require("../models");
const LogsModel = db.logs;
const UsersModel = db.users;
const { Op } = require("sequelize");

class LogsController {
  async recordLog(req, res) {
    const schema = Joi.object({
      actorId: Joi.number().integer().required(),
      action: Joi.string().required(),
      ip: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const user = await UsersModel.findByPk(req.body.actorId);
      if (!user) return res.status(404).send({message: "user not found"});

      const log = await LogsModel.create({
        actorId: req.body.actorId,
        action: req.body.action,
        ip: req.body.ip,
      });
      return res.status(201).send({ log });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async getLogs(req, res) {
    const schema = Joi.object({
      actorId: Joi.number().integer().optional(),
      action: Joi.string().optional(),
    });
    const { error } = schema.validate(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const user = await UsersModel.findByPk(req.query.userId);
      if (!user) return res.status(404).send({message: "user not found"});

      const where = {};
      if (req.query.actorId) {
        where.actorId = req.query.actorId;
      }
      if (req.query.action) {
        where.action = { [Op.like]: `%${req.query.action}%` };
      }
      const logs = await LogsModel.findAll({ where });
      return res.status(200).send({ logs });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new LogsController();
