"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../auth/middleware/auth.middleware");
const validate_middleware_1 = require("../../../middleware/validate.middleware"); // Импорт твоего универсального валидатора
const product_controller_1 = require("../controller/product.controller");
const product_schema_1 = require("../schemas/product.schema");
const role_middleware_1 = require("../../../middleware/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// 1. Получить все (проверка данных не нужна)
router.get('/', auth_middleware_1.authenticate, product_controller_1.getAllProducts);
// 2. Получить один (проверяем, что ID в URL — это корректный CUID)
router.get('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(product_schema_1.productIdSchema), product_controller_1.getSingleProduct);
// 3. Создать (проверяем всё тело запроса по схеме создания)
router.post('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(product_schema_1.createProductSchema), product_controller_1.addProduct);
// 4. Обновить (проверяем и ID в URL, и тело запроса)
router.patch('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(product_schema_1.productIdSchema), (0, validate_middleware_1.validate)(product_schema_1.updateProductSchema), product_controller_1.updateProduct);
// 5. Удалить (проверяем только корректность ID в URL)
router.delete('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN), (0, validate_middleware_1.validate)(product_schema_1.productIdSchema), product_controller_1.deleteProduct);
exports.default = router;
