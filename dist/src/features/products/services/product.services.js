"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductService = exports.updateProductService = exports.createProductService = exports.getProductByIdService = exports.getAllProductsService = void 0;
const utils_prisma_1 = __importDefault(require("../../../utils/utils.prisma"));
const client_1 = require("@prisma/client");
const getAllProductsService = async () => {
    return await utils_prisma_1.default.product.findMany({
        where: { deletedAt: null },
        // include: { user: { select: { name: true, email: true } } }
    });
};
exports.getAllProductsService = getAllProductsService;
const getProductByIdService = async (productId, userId) => {
    return await utils_prisma_1.default.product.findFirst({
        where: { id: productId, userId: userId, deletedAt: null }
    });
};
exports.getProductByIdService = getProductByIdService;
const createProductService = async (data, userId) => {
    const existingSku = await utils_prisma_1.default.product.findUnique({
        where: { sku: data.sku }
    });
    if (existingSku) {
        throw new Error(`SKU_EXISTS:${data.sku}`);
    }
    return await utils_prisma_1.default.$transaction(async (tx) => {
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
    });
};
exports.createProductService = createProductService;
const updateProductService = async (productId, userId, data) => {
    return await utils_prisma_1.default.$transaction(async (tx) => {
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
exports.updateProductService = updateProductService;
const deleteProductService = async (productId, userId, role) => {
    const whereCondition = role === client_1.Role.ADMIN
        ? { id: productId, deletedAt: null }
        : { id: productId, userId: userId, deletedAt: null };
    const result = await utils_prisma_1.default.product.updateMany({
        where: whereCondition,
        data: { deletedAt: new Date() }
    });
    return result.count > 0;
};
exports.deleteProductService = deleteProductService;
