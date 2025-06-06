const Joi = require("joi");
const jwt = require("jsonwebtoken");
const db = require("../models");
const UsersModel = db.users;
const _ = require("lodash");

const otpStore = new Map();

class AuthController {
  async registerUser(req, res) {
    try {
      const schema = Joi.object({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().min(11).max(11).required(),
        email: Joi.string().email().required(),
        role: Joi.string()
          .valid("customer", "owner", "staff", "admin", "guard")
          .required(),
        password: Joi.string().min(8).max(255).required(),
      });

      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { phoneNumber } = req.body;

      const userExists = await UsersModel.findOne({
        where: {
          phoneNumber: phoneNumber,
          role: req.body.role,
        },
      });
      if (userExists)
        return res.status(404).send({ message: "User already exists" });

      const user = await UsersModel.create(req.body);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).send({
        message: "User created successfully",
        userData: _.pick(user, [
          "id",
          "fullName",
          "email",
          "phoneNumber",
          "role",
        ]),
        token,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(11).required(),
        password: Joi.string().min(8).max(255).required(),
      });

      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { phoneNumber, password } = req.body;

      const user = await UsersModel.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      if (!user) return res.status(404).send({ message: "User not found" });

      const validatePassword = await user.comparePassword(password);
      if (!validatePassword)
        return res.status(401).send({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        message: "User logged in successfully",
        userData: _.pick(user, [
          "id",
          "fullName",
          "email",
          "phoneNumber",
          "role",
        ]),
        token,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async sendOtp(req, res) {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(11).required(),
      });

      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { phoneNumber } = req.body;

      // Generate random 5-digit OTP
      const otp = Math.floor(10000 + Math.random() * 90000);
      const expiresAt = Date.now() + 3 * 60 * 1000;

      otpStore.delete(phoneNumber);
      otpStore.set(phoneNumber, { otp, expiresAt });

      res.status(200).send(otp);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.string().min(11).max(11).required(),
        otp: Joi.number().required(),
        role: Joi.string()
          .valid("customer", "owner", "reception", "admin")
          .required(),
      });

      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { phoneNumber, otp, role } = req.body;
      const record = otpStore.get(phoneNumber);

      if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
        return res.status(400).send({ message: "Invalid or expired OTP" });
      }

      otpStore.delete(phoneNumber);

      let user = await UsersModel.findOne({
        where: {
          phoneNumber,
          ...(role && { role }),
        },
      });

      if (!user) {
        // Provide default values for required fields fullName and email
        user = await UsersModel.create({
          phoneNumber,
          role,
          password: "12345678",
          fullName: "New User",
          email: `user${Date.now()}@example.com`,
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({
        message:
          user.createdAt === user.updatedAt
            ? "User registered"
            : "User logged in",
        userData: _.pick(user, [
          "id",
          "fullName",
          "email",
          "phoneNumber",
          "role",
        ]),
        token,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new AuthController();
