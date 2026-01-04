import { NextFunction, Request, Response } from "express";
import prisma from "../utils/utils.prisma";

export const checkOwnershipMiddleware = (model: string) => {


    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId!
        const prodId = req.params.id
        const product = await (prisma as any)[model].findUnique({
            where: {
                id: prodId,
                userId
            }
        })

        const canSee = userId === product?.userId
        // next()
        canSee ? next() : res.json({
            status: 403,
            message: "Fu** You"
        })
    }




}