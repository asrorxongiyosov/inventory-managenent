"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                status: 'fail',
                message: 'Validation Error',
                errors: error.issues.map(issue => ({
                    path: issue.path.length > 1 ? issue.path.slice(1).join('.') : issue.path[0],
                    message: issue.message
                }))
            });
        }
        next(error);
    }
};
exports.validate = validate;
