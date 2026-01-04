"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getSingleProduct = exports.getAllProducts = void 0;
const productService = __importStar(require("../services/product.services"));
const getUserId = (req) => req.user?.id || req.user?.userId;
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProductsService();
        res.status(200).json({ count: products.length, data: products });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAllProducts = getAllProducts;
const getSingleProduct = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const product = await productService.getProductByIdService(req.params.id, userId);
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json({ data: product });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getSingleProduct = getSingleProduct;
const addProduct = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        const product = await productService.createProductService(req.body, userId);
        res.status(201).json({ data: product });
    }
    catch (error) {
        if (error.message.startsWith('SKU_EXISTS:')) {
            const sku = error.message.split(":")[1];
            return res.status(409).json({
                error: `Артикул "${sku}" уже занят другим товаром.`
            });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.addProduct = addProduct;
const updateProduct = async (req, res) => {
    try {
        const userId = getUserId(req);
        const updated = await productService.updateProductService(req.params.id, userId, req.body);
        if (!updated)
            return res.status(404).json({ error: 'Product not found or access denied' });
        res.json({ message: "Updated", data: updated });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const user = req.user;
    try {
        const success = await productService.deleteProductService(req.params.id, user?.userId, user?.role);
        if (!success) {
            return res.status(404).json({ error: 'Product not found or access denied' });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteProduct = deleteProduct;
