"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_prisma_1 = __importDefault(require("../../../utils/utils.prisma"));
const registerUser = async (userData) => {
    const { email, password, name } = userData;
    const existingUser = await utils_prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await utils_prisma_1.default.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (credentials) => {
    const { email, password } = credentials;
    const user = await utils_prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !user.isActive) {
        throw new Error('Invalid email or password');
    }
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3d' });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
