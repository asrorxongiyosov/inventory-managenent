import { Request, Response } from 'express';
import * as authService from '../services/auth.services';

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            data: user,
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || 'Registration failed',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};