import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../utils/utils.prisma';


export const registerUser = async (userData: any) => {
    const { email, password, name } = userData;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
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
export const loginUser = async (credentials: any) => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.isActive) {
        throw new Error('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '3d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};