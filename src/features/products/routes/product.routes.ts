import { Router } from 'express';
import { authenticate } from "../../auth/middleware/auth.middleware";
import { validate } from "../../../middleware/validate.middleware"; // Импорт твоего универсального валидатора
import {
    getAllProducts,
    addProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
} from "../controller/product.controller";
import {
    createProductSchema,
    updateProductSchema,
    productIdSchema
} from '../schemas/product.schema';

import { authorize } from '../../../middleware/role.middleware';
import { Role } from '@prisma/client';
import { checkOwnershipMiddleware } from '../../../middleware/checkOwnership';

const router = Router();

// 1. Получить все (проверка данных не нужна)
router.get('/', authenticate, getAllProducts);

// 2. Получить один (проверяем, что ID в URL — это корректный CUID)
router.get('/:id',
    authenticate,
    checkOwnershipMiddleware("product"),
    validate(productIdSchema),
    getSingleProduct
);

// 3. Создать (проверяем всё тело запроса по схеме создания)
router.post('/',
    authenticate,

    validate(createProductSchema),
    addProduct
);

// 4. Обновить (проверяем и ID в URL, и тело запроса)
router.patch('/:id',
    authenticate,
    validate(productIdSchema),
    validate(updateProductSchema),
    updateProduct
);

// 5. Удалить (проверяем только корректность ID в URL)
router.delete('/:id',
    authenticate,
    authorize(Role.ADMIN),
    validate(productIdSchema),
    deleteProduct
);

export default router;