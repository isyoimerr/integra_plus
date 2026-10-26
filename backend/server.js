import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import app from './src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos MySQL establecida');
  } catch (err) {
    console.error('❌ No se puede conectar a la base de datos:', err.message);
    console.warn('⚠️ El backend iniciará de todos modos; las rutas que dependen de BD pueden devolver 503 hasta que MySQL esté disponible.');
  } finally {
    try {
      await prisma.$disconnect();
    } catch {
      // Ignorar errores de cierre en el chequeo inicial.
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend INTEGRA+ corriendo en puerto ${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();
