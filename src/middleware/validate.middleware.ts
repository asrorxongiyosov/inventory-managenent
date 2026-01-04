import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
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