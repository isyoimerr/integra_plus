import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { levelService } from '../src/services/level.service.js';

dotenv.config();
const prisma = new PrismaClient();

async function safe(fn) {
  try {
    await fn();
  } catch (e) {
    console.error('ERROR:', e.message || e);
  }
}

async function main() {
  console.log('Iniciando test de flujo de niveles...');

  // 1) Crear un usuario + estudiante de prueba
  const email = `test+${Date.now()}@local.invalid`;
  const usuario = await prisma.usuario.create({ data: { usuNombre: 'Test User', usuCorreo: email, usuContrasena: 'x' } });
  const estudiante = await prisma.estudiante.create({ data: { estUsuId: usuario.usuId } });
  const estId = estudiante.estId;
  console.log('Estudiante creado id=', estId);

  // 2) Crear 2 niveles: A (sin prereq) y B (con prereq = A)
  const nivelA = await prisma.nivel.create({ data: { nivNombre: 'Nivel A (test)', nivModulo: 1, nivDificultad: 1, nivColor: '#00A' } });
  const nivelB = await prisma.nivel.create({ data: { nivNombre: 'Nivel B (test)', nivModulo: 2, nivDificultad: 2, nivPrerequisito: nivelA.nivId, nivColor: '#0A0' } });
  console.log('Niveles creados:', nivelA.nivId, nivelB.nivId);

  // 3) Asegurar que no hay progreso
  const progBefore = await levelService.getProgress(estId);
  console.log('Progreso inicial:', progBefore);

  // 4) Completar nivel A usando levelService.complete
  console.log('Completando nivel A...');
  const res = await levelService.complete(estId, nivelA.nivId, 0);
  console.log('Resultado complete:', res);

  // 5) Consultar progreso después
  const progAfter = await levelService.getProgress(estId);
  console.log('Progreso después:', progAfter);

  // 6) Verificar que nivel B está desbloqueable según progreso en DB
  const checkProgB = progAfter.find(p => p.nivelId === nivelB.nivId);
  console.log('Progreso para B en DB (debe ser undefined o null):', checkProgB);

  // 7) Leer niveles y sus prerequisitos
  const niveles = await levelService.getAll();
  console.log('Niveles (getAll):', niveles);

  console.log('\nResumen de verificación:');
  console.log('- Nivel A completado en progreso:', progAfter.some(p => p.nivelId === nivelA.nivId && p.completado));
  console.log('- Nivel B prerequisito apunta a A (niveles):', niveles.find(n => n.id === nivelB.nivId)?.prerequisito === nivelA.nivId);

  // cleanup: (opcional) eliminar lo creado para pruebas
  console.log('\nLimpieza de datos de prueba...');
  await prisma.progreso.deleteMany({ where: { proEstId: estId } });
  await prisma.resultado.deleteMany({ where: { resEstId: estId } });
  await prisma.estudiante.delete({ where: { estId } });
  await prisma.usuario.delete({ where: { usuId: usuario.usuId } });
  await prisma.nivel.delete({ where: { nivId: nivelB.nivId } });
  await prisma.nivel.delete({ where: { nivId: nivelA.nivId } });

  console.log('Test finalizado correctamente.');
}

safe(main).finally(() => prisma.$disconnect());
