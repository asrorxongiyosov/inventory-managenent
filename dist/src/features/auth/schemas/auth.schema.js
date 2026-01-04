"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(5).max(50),
        email: zod_1.z.string().trim().email(),
        password: zod_1.z
            .string()
            .min(6, 'Пароль должен быть не менее 6 символов')
            .regex(/[a-zA-Z]/, 'Пароль должен содержать хотя бы одну букву'),
    }),
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().trim().email('Некорректный формат email'),
        password: zod_1.z.string().trim().min(1, 'Пароль обязателен'),
    }),
});
