import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import levelRoutes from './routes/level.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',     authRoutes);
app.use('/api/user',     userRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/level',    levelRoutes);
app.use('/api/teacher',  teacherRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'INTEGRA+ API is running', health: '/health' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'Backend INTEGRA+ running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
