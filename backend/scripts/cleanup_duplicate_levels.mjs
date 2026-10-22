import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const apply = process.argv.includes('--apply');
  const niveles = await prisma.nivel.findMany({ orderBy: [{ nivModulo: 'asc' }, { nivId: 'asc' }] });

  const moduleGroups = niveles.reduce((acc, nivel) => {
    const key = nivel.nivModulo;
    if (!acc[key]) acc[key] = [];
    acc[key].push(nivel);
    return acc;
  }, {});

  const duplicates = Object.entries(moduleGroups)
    .filter(([, group]) => group.length > 1)
    .map(([module, group]) => ({ module: Number(module), group }));

  if (duplicates.length === 0) {
    console.log('No se encontraron niveles duplicados por modulo.');
    await prisma.$disconnect();
    return;
  }

  console.log('Niveles duplicados detectados por módulo:');
  duplicates.forEach(({ module, group }) => {
    console.log(`\nMódulo ${module}:`);
    group.forEach((nivel) => {
      console.log(`  - id=${nivel.nivId}, nombre='${nivel.nivNombre}', prerequisito=${nivel.nivPrerequisito}, desbloqueado=${nivel.nivDesbloqueado}`);
    });
  });

  if (!apply) {
    console.log('\nEjecuta el script con --apply para intentar limpiar los duplicados de manera segura.');
    await prisma.$disconnect();
    return;
  }

  for (const { module, group } of duplicates) {
    const canonical = group.find((nivel) => nivel.nivDesbloqueado) || group[0];
    const duplicatesToRemove = group.filter((nivel) => nivel.nivId !== canonical.nivId);

    console.log(`\nProcesando módulo ${module}: mantengo id=${canonical.nivId}`);

    for (const dup of duplicatesToRemove) {
      const [ejCount, progCount, estadoCount, prereqCount] = await Promise.all([
        prisma.ejercicio.count({ where: { ejNivId: dup.nivId } }),
        prisma.progreso.count({ where: { proNivId: dup.nivId } }),
        prisma.estadoSigma.count({ where: { sigNivActual: dup.nivId } }),
        prisma.nivel.count({ where: { nivPrerequisito: dup.nivId } }),
      ]);

      console.log(`  - Duplicate id=${dup.nivId}: ejercicios=${ejCount}, progreso=${progCount}, estadosSigma=${estadoCount}, referenciadoPorPrereq=${prereqCount}`);

      if (ejCount === 0 && progCount === 0 && estadoCount === 0 && prereqCount === 0) {
        await prisma.nivel.delete({ where: { nivId: dup.nivId } });
        console.log(`    -> Eliminado id=${dup.nivId}`);
      } else {
        console.log(`    -> No se elimina porque tiene registros relacionados. Revisión manual recomendada.`);
      }
    }
  }

  console.log('\nLimpieza de duplicados finalizada. Revisa los niveles con ids no eliminados si hay relaciones.');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error en cleanup_duplicate_levels:', error);
  process.exit(1);
}).finally(() => prisma.$disconnect());
