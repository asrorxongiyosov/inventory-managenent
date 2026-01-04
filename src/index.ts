import express from "express";
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";


import productRoutes from './features/products/routes/product.routes';
// import authRoutes from './features/users/routes/user.routes';
import authRoutes from './features/auth/routes/auth.routes';
dotenv.config();

const app = express();


app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => {
    res.json({ message: 'Inventory API is running!' });
});


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`, `Api docs are running on http://localhost:${PORT}/api-docs`);
});

