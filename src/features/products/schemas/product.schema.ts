import { z } from 'zod';

const productFields = {
    name: z.string().trim().min(3, "Минимум 3 символа").max(100),
    description: z.string().trim().max(500).optional(),
    sku: z.string()
        .trim().min(3, "SKU должен быть минимум 3 символа")
        .regex(/^[A-Z0-9-]+$/, "SKU может содержать только заглавные буквы, цифры и дефисы")
        .trim(),
    quantity: z.number().int().min(0, "Количество не может быть отрицательным"),
    price: z.number().positive("Цена должна быть > 0"),
};

export const createProductSchema = z.object({
    body: z.object(productFields)
});

export const updateProductSchema = z.object({
    body: z.object(productFields).partial()
});

export const productIdSchema = z.object({
    params: z.object({
        id: z.string().cuid("Неверный формат ID")
    })
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];