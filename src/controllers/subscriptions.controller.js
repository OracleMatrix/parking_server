const Joi = require("joi");
const db = require("../models");
const SubscriptionsModel = db.subscriptions;
const ParkingsModel = db.parkings;

class SubscriptionsController {
  async createSubscription(req, res) {
    const schema = Joi.object({
      parkingId: Joi.number().integer().required(),
      name: Joi.string().required(),
      durationDays: Joi.number().integer().required(),
      price: Joi.number().precision(2).required(),
      vehicleType: Joi.string().valid("car", "motorcycle", "truck").required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const parkingExists = await ParkingsModel.findByPk(req.body.parkingId);
      if (!parkingExists)
        return res.status(404).send({ message: "Parking not found" });

      const subscription = await SubscriptionsModel.create(req.body);
      return res.status(201).send({ subscription });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async updateSubscription(req, res) {
    const schema = Joi.object({
      subscriptionId: Joi.number().integer().required(),
      parkingId: Joi.number().integer().optional(),
      name: Joi.string().optional(),
      durationDays: Joi.number().integer().optional(),
      price: Joi.number().precision(2).optional(),
      vehicleType: Joi.string().valid("car", "motorcycle", "truck").optional(),
    });
    const { error } = schema.validate({ ...req.params, ...req.body });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const subscription = await SubscriptionsModel.findByPk(
        req.params.subscriptionId
      );
      if (!subscription)
        return res.status(404).send({ message: "Subscription not found" });

      if (req.body.parkingId) {
        const parkingExists = await ParkingsModel.findByPk(req.body.parkingId);
        if (!parkingExists)
          return res.status(404).send({ message: "Parking not found" });
      }

      const { parkingId, name, durationDays, price, vehicleType } = req.body;
      if (parkingId !== undefined) subscription.parkingId = parkingId;
      if (name !== undefined) subscription.name = name;
      if (durationDays !== undefined) subscription.durationDays = durationDays;
      if (price !== undefined) subscription.price = price;
      if (vehicleType !== undefined) subscription.vehicleType = vehicleType;

      await subscription.save();

      return res.status(200).send({ subscription });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async deleteSubscription(req, res) {
    const schema = Joi.object({
      subscriptionId: Joi.number().integer().required(),
    });
    const { error } = schema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const subscription = await SubscriptionsModel.findByPk(
        req.params.subscriptionId
      );
      if (!subscription)
        return res.status(404).send({ message: "Subscription not found" });

      await subscription.destroy();

      return res
        .status(200)
        .send({ message: "Subscription deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async getSubscriptionById(req, res) {
    const schema = Joi.object({
      subscriptionId: Joi.number().integer().required(),
    });
    const { error } = schema.validate(req.params);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    try {
      const subscription = await SubscriptionsModel.findByPk(
        req.params.subscriptionId
      );
      if (!subscription)
        return res.status(404).send({ message: "Subscription not found" });

      return res.status(200).send({ subscription });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new SubscriptionsController();
