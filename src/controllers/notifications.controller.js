const Joi = require("joi");
const db = require("../models");
const NotificationsModel = db.notifications;
const UsersModel = db.users;

class NotificationsController {
  async sendNotification(req, res) {
    const schema = Joi.object({
      userId: Joi.number().integer().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      read: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const user = await UsersModel.findByPk(req.body.userId);
      if (!user) return res.status(404).send({message: "user not found"});

      const notification = await NotificationsModel.create({
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body,
        read: req.body.read || false,
      });
      return res.status(201).send({ notification });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async getNotificationsByUser(req, res) {
    const schema = Joi.object({
      userId: Joi.number().integer().required(),
    });
    const { error } = schema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const user = await UsersModel.findByPk(req.params.userId);
      if (!user) return res.status(404).send({message: "user not found"});

      const notifications = await NotificationsModel.findAll({
        where: { userId: req.params.userId },
      });
      return res.status(200).send({ notifications });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new NotificationsController();
