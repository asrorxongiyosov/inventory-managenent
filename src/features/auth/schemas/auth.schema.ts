import { z } from 'zod';

export const registerUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(5).max(50),
        email: z.string().trim().email(),
        password: z
            .string()
            .min(6, 'Пароль должен быть не менее 6 символов')
            .regex(/[a-zA-Z]/, 'Пароль должен содержать хотя бы одну букву'),
    }),
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().trim().email('Некорректный формат email'),
        password: z.string().trim().min(1, 'Пароль обязателен'),
    }),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body']
