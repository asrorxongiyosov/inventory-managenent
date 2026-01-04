import { Request, Response } from 'express';
import * as productService from '../services/product.services';



const getUserId = (req: Request) => (req as any).user?.id || (req as any).user?.userId;

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProductsService();
        res.status(200).json({ count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const product = await productService.getProductByIdService(req.params.id, userId!);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addProduct = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || (req as any).user?.userId;
        const product = await productService.createProductService(req.body, userId);
        res.status(201).json({ data: product });
    } catch (error: any) {
        if (error.message.startsWith('SKU_EXISTS:')) {
            const sku = error.message.split(":")[1];
            return res.status(409).json({
                error: `Артикул "${sku}" уже занят другим товаром.`
            })
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const updated = await productService.updateProductService(req.params.id, userId, req.body);

        if (!updated) return res.status(404).json({ error: 'Product not found or access denied' });
        res.json({ message: "Updated", data: updated });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const success = await productService.deleteProductService(
            req.params.id,
            user?.userId!,
            user?.role!
        );

        if (!success) {
            return res.status(404).json({ error: 'Product not found or access denied' });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


