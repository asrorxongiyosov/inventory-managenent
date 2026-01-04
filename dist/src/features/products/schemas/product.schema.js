"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const productFields = {
    name: zod_1.z.string().trim().min(3, "Минимум 3 символа").max(100),
    description: zod_1.z.string().trim().max(500).optional(),
    sku: zod_1.z.string()
        .trim().min(3, "SKU должен быть минимум 3 символа")
        .regex(/^[A-Z0-9-]+$/, "SKU может содержать только заглавные буквы, цифры и дефисы")
        .trim(),
    quantity: zod_1.z.number().int().min(0, "Количество не может быть отрицательным"),
    price: zod_1.z.number().positive("Цена должна быть > 0"),
};
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object(productFields)
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object(productFields).partial()
});
exports.productIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().cuid("Неверный формат ID")
    })
});
