import assert from 'assert';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { levelService } from '../src/services/level.service.js';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('=== Test de levelService ===');

  const levels = await levelService.getAll();
  assert(Array.isArray(levels), 'getAll debe retornar un arreglo');
  assert(levels.length >= 3, 'Debe haber al menos 3 niveles configurados');

  const moduloSet = new Set(levels.map((level) => level.modulo));
  assert(moduloSet.size === levels.length, 'Los niveles deberían tener módulos únicos en la configuración actual');
  assert(levels.some((level) => level.modulo === 0), 'Debe existir el nivel 0');
  assert(levels.some((level) => level.modulo === 1), 'Debe existir el nivel 1');
  assert(levels.some((level) => level.modulo === 2), 'Debe existir el nivel 2');

  // Crear usuario/estudiante de prueba
  const timestamp = Date.now();
  const correo = `test-level-${timestamp}@local.invalid`;
  const usuario = await prisma.usuario.create({ data: { usuNombre: 'Test Nivel', usuCorreo: correo, usuContrasena: 'x' } });
  const estudiante = await prisma.estudiante.create({ data: { estUsuId: usuario.usuId } });

  try {
    const progresoInicial = await levelService.getProgress(estudiante.estId);
    assert(Array.isArray(progresoInicial), 'getProgress debe retornar un arreglo');
    assert(progresoInicial.length === 0, 'Un estudiante nuevo no debe tener progreso');

    const nivel0 = levels.find((item) => item.modulo === 0);
    assert(nivel0, 'Debe existir un nivel con modulo 0');

    const nivel1 = levels.find((item) => item.modulo === 1);
    assert(nivel1, 'Debe existir un nivel con modulo 1');

    let bloqueo = false;
    try {
      await levelService.complete(estudiante.estId, nivel1.id, 0);
    } catch (err) {
      bloqueo = true;
      assert(err.message.includes('bloqueado'), 'Debe bloquear el nivel 1 si no completó el prerequisito');
    }
    assert(bloqueo, 'El nivel 1 debería estar bloqueado hasta completar el nivel 0');

    const completion = await levelService.complete(estudiante.estId, nivel0.id, 1);
    assert(completion.completado === true, 'complete debería marcar el nivel como completado');
    assert(completion.stars === 2, 'Con 1 error debe asignar 2 estrellas');
    assert(completion.ejerciciosTotal >= 0, 'Debe devolver ejerciciosTotal válido');

    const progresoPosterior = await levelService.getProgress(estudiante.estId);
    const registro = progresoPosterior.find((item) => item.nivelId === nivel0.id);
    assert(registro, 'Debe existir registro de progreso para el nivel completado');
    assert(registro.completado === true, 'El registro debe tener completado=true');

    const completionNivel1 = await levelService.complete(estudiante.estId, nivel1.id, 0);
    assert(completionNivel1.completado === true, 'complete debería permitir nivel 1 después de completar prerequisito');

    console.log('✅ Todos los tests de levelService pasaron');
  } finally {
    await prisma.progreso.deleteMany({ where: { proEstId: estudiante.estId } });
    await prisma.estadoSigma.deleteMany({ where: { sigEstId: estudiante.estId } });
    await prisma.estudiante.delete({ where: { estId: estudiante.estId } });
    await prisma.usuario.delete({ where: { usuId: usuario.usuId } });
  }
}

main().catch((error) => {
  console.error('Fallo test:', error);
  process.exit(1);
}).finally(() => prisma.$disconnect());
