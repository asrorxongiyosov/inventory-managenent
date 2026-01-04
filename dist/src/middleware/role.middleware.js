"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Не авторизован" });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Доступ запрещен!}`
            });
        }
        next();
    };
};
exports.authorize = authorize;
