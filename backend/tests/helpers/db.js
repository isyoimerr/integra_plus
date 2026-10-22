import { PrismaClient } from '@prisma/client';

const TEST_DB_URL = 'mysql://root:@127.0.0.1:3306/integra_plus_test';

export function createPrisma() {
  return new PrismaClient({ datasources: { db: { url: TEST_DB_URL } } });
}

export function setTestEnv() {
  process.env.DATABASE_URL = TEST_DB_URL;
  process.env.NODE_ENV = 'test';
}

export async function cleanDatabase(prisma) {
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of [
    'resultados', 'progreso', 'estado_sigma',
    'ejercicios', 'niveles', 'doc_estudiante',
    'estudiantes', 'docentes', 'codigos_recuperacion', 'usuarios',
  ]) {
    await prisma.$executeRawUnsafe(`DELETE FROM \`${table}\``);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
  }
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
}

export async function seedBaseData(prisma) {
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');

  await prisma.nivel.createMany({
    data: [
      { nivId: 1, nivNombre: 'Repaso de Bases', nivModulo: 0, nivDificultad: 1, nivColor: '#2E7D32', nivDesbloqueado: true },
      { nivId: 2, nivNombre: 'Integral Indefinida', nivModulo: 1, nivDificultad: 2, nivColor: '#1565C0', nivPrerequisito: 1 },
      { nivId: 3, nivNombre: 'Integral Definida', nivModulo: 2, nivDificultad: 3, nivColor: '#7E57C2', nivPrerequisito: 2 },
    ],
  });

  await prisma.ejercicio.createMany({
    data: [
      { ejNivId: 1, ejEnunciado: '2+2', ejRespuesta: '4', ejXpRecompensa: 10, ejOrden: 1 },
      { ejNivId: 1, ejEnunciado: '3+3', ejRespuesta: '6', ejXpRecompensa: 10, ejOrden: 2 },
      { ejNivId: 2, ejEnunciado: '∫x dx', ejFormula: '\\int x\\,dx', ejRespuesta: 'x²/2 + C', ejXpRecompensa: 15, ejOrden: 1 },
      { ejNivId: 3, ejEnunciado: '∫₀¹ x dx', ejFormula: '\\int_0^1 x\\,dx', ejRespuesta: '1/2', ejXpRecompensa: 20, ejOrden: 1 },
    ],
  });

  await prisma.usuario.create({
    data: { usuId: 1, usuNombre: 'Test', usuCorreo: 'test@test.com', usuContrasena: 'x', usuRol: 'estudiante' },
  });

  await prisma.estudiante.create({
    data: { estId: 1, estUsuId: 1, estPuntaje: 0 },
  });

  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
}
