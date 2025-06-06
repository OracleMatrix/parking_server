// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Parking API",
            version: "1.0.0",
            description: "A Parking API built with Express and Sequelize",
        },
        components: {
            securitySchemes: {
                AuthorizationHeader: {
                    type: "apiKey",
                    in: "header",
                    name: "authentication",
                },
            },
        },
        security: [
            {
                AuthorizationHeader: [],
            },
        ],
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
