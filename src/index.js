const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const db = require("./models");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// MIDDLEWARES
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ROUTES
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/vehicles", require("./routes/vehicles.routes"));
app.use("/api/parkings", require("./routes/parkings.routes"));
app.use("/api/parkings-slots", require("./routes/parkings_slot.routes"));
app.use("/api/reservations", require("./routes/reservations.routes"));
app.use("/api/checkins", require("./routes/checkins.routes"));
app.use("/api/payments", require("./routes/payments.routes"));
app.use("/api/notifications", require("./routes/notifications.routes"));
app.use("/api/logs", require("./routes/logs.routes"));
app.use("/api/subscriptions", require("./routes/subscriptions.routes"));

db.sequelize.sync().then(() => {
  console.log("Sequelize has been initialized...");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});
