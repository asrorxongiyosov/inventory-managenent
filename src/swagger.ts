import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation",
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/features/**/routes/*.ts"],

});

export default swaggerSpec;
