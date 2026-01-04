import { diff } from 'node:util';
import prisma from '../../../utils/utils.prisma';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema';
import { Role } from '@prisma/client';

export const getAllProductsService = async () => {
    return await prisma.product.findMany({
        where: { deletedAt: null },
        // include: { user: { select: { name: true, email: true } } }
    });
};

export const getProductByIdService = async (productId: string, userId: string) => {
    return await prisma.product.findFirst({
        where: { id: productId, userId: userId, deletedAt: null }
    });
};

export const createProductService = async (data: CreateProductInput, userId: string) => {

    const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku }
    });
    if (existingSku) {
        throw new Error(`SKU_EXISTS:${data.sku}`);
    }

    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
            data: {
                ...data,
                userId

            }
        });

        if (product.quantity > 0) {
            await tx.stockMovement.create({
                data: {
                    productId: product.id,
                    userId: userId,
                    quantity: product.quantity,
                    type: "IN",
                    reason: "Initial stock upon product creation"
                }
            });
        }

        return product;
    })
};

export const updateProductService = async (productId: string, userId: string, data: UpdateProductInput) => {
    return await prisma.$transaction(async (tx) => {
        const existingProduct = await tx.product.findFirst({
            where: { id: productId, userId: userId }
        });

        if (!existingProduct) {
            throw new Error("Product not found or access denied");
        }

        const updatedProduct = await tx.product.update({
            where: { id: productId },
            data: {
                ...data,
                updatedAt: new Date(),
            }
        });

        if (data.quantity !== undefined && data.quantity !== existingProduct.quantity) {
            const diff = data.quantity - existingProduct.quantity;
            await tx.stockMovement.create({
                data: {
                    productId: productId,
                    userId: userId,
                    type: diff > 0 ? "IN" : "OUT",
                    quantity: data.quantity,
                    reason: `Stock updated from ${existingProduct.quantity} to ${data.quantity}`
                }
            });
        }

        return updatedProduct;
    });
};

export const deleteProductService = async (
    productId: string,
    userId: string,
    role: Role
) => {
    const whereCondition = role === Role.ADMIN
        ? { id: productId, deletedAt: null }
        : { id: productId, userId: userId, deletedAt: null };

    const result = await prisma.product.updateMany({
        where: whereCondition,
        data: { deletedAt: new Date() }
    });

    return result.count > 0;
};

