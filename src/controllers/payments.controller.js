const Joi = require("joi");
const db = require("../models");
const PaymentsModel = db.payments;
const UsersModel = db.users;

class PaymentsController {
  async processPayment(req, res) {
    const schema = Joi.object({
      userId: Joi.number().integer().required(),
      amount: Joi.number().positive().required(),
      type: Joi.string().valid("hourly", "subscription", "fine").required(),
      method: Joi.string().valid("card", "cash", "online", "wallet").required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const user = await UsersModel.findByPk(req.body.userId);
      if (!user) return res.status(404).send({message: "user not found"});

      const payment = await PaymentsModel.create({
        userId: req.body.userId,
        amount: req.body.amount,
        type: req.body.type,
        method: req.body.method,
      });

      return res.status(201).send({ payment });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async getPaymentsByUser(req, res) {
    const schema = Joi.object({
      userId: Joi.number().integer().required(),
    });
    const { error } = schema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const user = await UsersModel.findByPk(req.params.userId);
      if (!user) return res.status(404).send({message: "user not found"});

      const payments = await PaymentsModel.findAll({
        where: { userId: req.params.userId },
      });
      return res.status(200).send({ payments });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new PaymentsController();
